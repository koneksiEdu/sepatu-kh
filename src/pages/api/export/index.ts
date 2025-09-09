// /api/export.ts
import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
import { users } from "../../../lib/schema/users";
import { staff } from "../../../lib/schema/staff";
import { verifyAccessToken } from "../../../lib/auth";

export interface AuthPayload {
  id: string;
  role: string;
  email: string;
}

async function requireRole(request: Request, roles: string[] = []): Promise<AuthPayload> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const payload = (await verifyAccessToken(token)) as unknown as AuthPayload;

  if (roles.length > 0 && !roles.includes(payload.role)) {
    throw new Error("Forbidden");
  }

  return payload;
}

function formatDate(timestamp: any): string {
  if (!timestamp) return "";
  
  try {
    // Coba parsing sebagai Date langsung
    const date = new Date(timestamp);
    
    // Jika timestamp numerik (dalam detik), konversi ke milidetik
    if (isNaN(date.getTime()) && !isNaN(Number(timestamp))) {
      return new Date(Number(timestamp) * 1000).toISOString().split('T')[0];
    }
    
    return isNaN(date.getTime()) ? "" : date.toISOString().split('T')[0];
  } catch {
    return "";
  }
}

function generateCSV(data: any[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => {
    return headers.map(header => {
      const value = row[header];
      // Handle values that might contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value || '';
    }).join(',');
  });
  
  return [csvHeaders, ...csvRows].join('\n');
}

function generateFilename(type: string, format: string): string {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  return `sepatu_kh_${type}_${date}_${time}.${format}`;
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // Require admin role for export functionality
    await requireRole(request, ["admin"]);
    
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "all"; // all, staff, users
    const format = url.searchParams.get("format") || "json"; // json, csv

    // Validate parameters
    if (!["all", "staff", "users"].includes(type)) {
      return new Response(JSON.stringify({ 
        error: "Parameter 'type' harus berupa: all, staff, atau users" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!["json", "csv"].includes(format)) {
      return new Response(JSON.stringify({ 
        error: "Parameter 'format' harus berupa: json atau csv" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    let exportData: any = {};
    let filename = "";

    try {
      // Export staff data
      if (type === "all" || type === "staff") {
        const staffData = await raguBase
          .select({
            id: staff.id,
            name: staff.name,
            position: staff.position
          })
          .from(staff)
          .orderBy(staff.id);

        exportData.staff = staffData;
      }

      // Export users data (excluding password and sensitive info)
      if (type === "all" || type === "users") {
        const usersData = await raguBase
          .select({
            id: users.id,
            email: users.email,
            name: users.name,
            role: users.role,
            created_at: users.created_at,
            is_verified: users.is_verified
          })
          .from(users)
          .orderBy(users.id);

        // Format created_at for better readability
        const formattedUsersData = usersData.map(user => ({
          ...user,
          created_at: user.created_at ? formatDate(user.created_at) : "Tanggal tidak valid",
          is_verified: user.is_verified ? "Terverifikasi" : "Belum Terverifikasi"
        }));

        exportData.users = formattedUsersData;
      }

      // Generate filename based on export type
      filename = generateFilename(type, format);

      // Handle JSON export
      if (format === "json") {
        const jsonData = {
          export_info: {
            timestamp: new Date().toISOString(),
            type: type,
            format: format,
            system: "SEPATU KH",
            version: "1.0"
          },
          data: exportData,
          summary: {
            staff_count: exportData.staff ? exportData.staff.length : 0,
            users_count: exportData.users ? exportData.users.length : 0,
            total_records: (exportData.staff ? exportData.staff.length : 0) + 
                          (exportData.users ? exportData.users.length : 0)
          }
        };

        return new Response(JSON.stringify(jsonData, null, 2), {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="${filename}"`
          }
        });
      }

      // Handle CSV export
      if (format === "csv") {
        let csvContent = "";

        if (type === "all") {
          // For combined export, create separate sections
          csvContent += "=== DATA STAFF SEPATU KH ===\n";
          if (exportData.staff && exportData.staff.length > 0) {
            const staffHeaders = ["id", "name", "position"];
            csvContent += generateCSV(exportData.staff, staffHeaders);
          } else {
            csvContent += "Tidak ada data staff\n";
          }
          
          csvContent += "\n\n=== DATA USERS SEPATU KH ===\n";
          if (exportData.users && exportData.users.length > 0) {
            const usersHeaders = ["id", "email", "name", "role", "created_at", "is_verified"];
            csvContent += generateCSV(exportData.users, usersHeaders);
          } else {
            csvContent += "Tidak ada data users\n";
          }
        } else if (type === "staff") {
          if (exportData.staff && exportData.staff.length > 0) {
            const staffHeaders = ["id", "name", "position"];
            csvContent = generateCSV(exportData.staff, staffHeaders);
          } else {
            csvContent = "id,name,position\n";
          }
        } else if (type === "users") {
          if (exportData.users && exportData.users.length > 0) {
            const usersHeaders = ["id", "email", "name", "role", "created_at", "is_verified"];
            csvContent = generateCSV(exportData.users, usersHeaders);
          } else {
            csvContent = "id,email,name,role,created_at,is_verified\n";
          }
        }

        return new Response(csvContent, {
          headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="${filename}"`
          }
        });
      }

      // If no format matched, return error Response (should never happen due to earlier validation)
      return new Response(JSON.stringify({ 
        error: "Format export tidak dikenali"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });

    } catch (dbError) {
      console.error("Database error during export:", dbError);
      return new Response(JSON.stringify({ 
        error: "Gagal mengambil data dari database",
        details: dbError instanceof Error ? dbError.message : "Unknown database error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

  } catch (error) {
    console.error("Export error:", error);
    
    // Handle different types of errors
    if (error instanceof Error) {
      if (error.message === "Unauthorized") {
        return new Response(JSON.stringify({ 
          error: "Token akses tidak valid atau sudah kadaluarsa" 
        }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        });
      }
      
      if (error.message === "Forbidden") {
        return new Response(JSON.stringify({ 
          error: "Akses ditolak. Hanya admin yang dapat mengekspor data" 
        }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }
    }

    return new Response(JSON.stringify({ 
      error: "Terjadi kesalahan saat mengekspor data",
      details: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};