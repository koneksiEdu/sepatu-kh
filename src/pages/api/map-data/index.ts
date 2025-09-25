import type { APIRoute } from "astro";
import raguBase from "../../../lib/koneksi";
import { applications } from "../../../lib/schema/applications";
import { fieldVerifications } from "../../../lib/schema/field_verifications";
import { pkkpr } from "../../../lib/schema/pkkpr";
import { eq, sql, and, isNotNull } from "drizzle-orm";
import { verifyAccessToken } from "../../../lib/auth";

export const GET: APIRoute = async ({ request }) => {
  try {
    // Verify authorization
    const authHeader = request.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ 
        message: "Unauthorized", 
        error: "Missing Authorization header" 
      }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return new Response(JSON.stringify({ 
        message: "Unauthorized", 
        error: "Invalid Authorization format" 
      }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Verify the token
    try {
      await verifyAccessToken(token);
    } catch (authError) {
      return new Response(JSON.stringify({ 
        message: "Unauthorized", 
        error: "Invalid or expired token" 
      }), { 
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Parse query parameters
    const url = new URL(request.url);
    const year = url.searchParams.get("year");
    const format = url.searchParams.get("format"); // For GeoJSON export

    console.log("API received year parameter:", year); // Debug log

    // TAMBAHAN: Debug query untuk melihat semua tahun yang tersedia
    try {
      const debugQuery = raguBase
        .select({
          createdAt: pkkpr.createdAt,
          year: sql`strftime('%Y', ${pkkpr.createdAt})`.as('year'),
          id: pkkpr.id
        })
        .from(pkkpr)
        .where(isNotNull(pkkpr.createdAt))
        .limit(10);
      
      const debugResults = await debugQuery.execute();
      console.log("Available years in database:", debugResults.map(r => ({
        id: r.id,
        createdAt: r.createdAt,
        year: r.year
      })));
    } catch (debugError) {
      if (debugError instanceof Error) {
        console.log("Debug query error:", debugError.message);
      } else {
        console.log("Debug query error:", debugError);
      }
    }

    // Build the base query with proper joins
    const baseConditions = [
      isNotNull(fieldVerifications.latitude),
      isNotNull(fieldVerifications.longitude),
      sql`${fieldVerifications.latitude} != 0 OR ${fieldVerifications.longitude} != 0`
    ];

    console.log("Query conditions:", baseConditions.length, "conditions applied"); // Debug log

    // PERBAIKAN: Query dengan join yang benar dan filter tahun
    let query = raguBase
      .select({
        id: fieldVerifications.id,
        pkkprId: fieldVerifications.pkkprId,
        isVerified: fieldVerifications.isVerified,
        latitude: fieldVerifications.latitude,
        longitude: fieldVerifications.longitude,
        verifiedAt: fieldVerifications.verifiedAt,
        name: applications.name,
        phone: applications.phone,
        actAs: applications.actAs,
        location: applications.location,
        landArea: applications.landArea,
        north: applications.north,
        south: applications.south,
        east: applications.east,
        west: applications.west,
        createdAt: pkkpr.createdAt,
        title: pkkpr.title,
        type: pkkpr.type,
        status: pkkpr.status,
      })
      .from(fieldVerifications)
      .leftJoin(applications, eq(fieldVerifications.pkkprId, applications.pkkprId))
      .leftJoin(pkkpr, eq(fieldVerifications.pkkprId, pkkpr.id))
      .where(and(...baseConditions));

    // PERBAIKAN: Filter tahun yang lebih tepat - filter setelah data diambil
    // karena mungkin ada masalah dengan SQL date function
    if (year && /^\d{4}$/.test(year)) {
      console.log("Applying year filter:", year); // Debug log
      // Tambahkan kondisi untuk memastikan pkkpr.createdAt tidak null dan sesuai tahun
      baseConditions.push(isNotNull(pkkpr.createdAt));
      baseConditions.push(sql`strftime('%Y', ${pkkpr.createdAt}) = ${year}`);
      
      // Update query dengan kondisi baru
      query = raguBase
        .select({
          id: fieldVerifications.id,
          pkkprId: fieldVerifications.pkkprId,
          isVerified: fieldVerifications.isVerified,
          latitude: fieldVerifications.latitude,
          longitude: fieldVerifications.longitude,
          verifiedAt: fieldVerifications.verifiedAt,
          name: applications.name,
          phone: applications.phone,
          actAs: applications.actAs,
          location: applications.location,
          landArea: applications.landArea,
          north: applications.north,
          south: applications.south,
          east: applications.east,
          west: applications.west,
          createdAt: pkkpr.createdAt,
          title: pkkpr.title,
          type: pkkpr.type,
          status: pkkpr.status,
        })
        .from(fieldVerifications)
        .leftJoin(applications, eq(fieldVerifications.pkkprId, applications.pkkprId))
        .leftJoin(pkkpr, eq(fieldVerifications.pkkprId, pkkpr.id)) // LEFT JOIN agar pkkpr nullable sesuai tipe
        .where(and(...baseConditions));
    } else {
      // Jika tidak ada tahun, gunakan tahun sekarang
      const currentYear = new Date().getFullYear().toString();
      console.log("Using current year:", currentYear); // Debug log
      baseConditions.push(isNotNull(pkkpr.createdAt));
      baseConditions.push(sql`strftime('%Y', ${pkkpr.createdAt}) = ${currentYear}`);
      
      query = raguBase
        .select({
          id: fieldVerifications.id,
          pkkprId: fieldVerifications.pkkprId,
          isVerified: fieldVerifications.isVerified,
          latitude: fieldVerifications.latitude,
          longitude: fieldVerifications.longitude,
          verifiedAt: fieldVerifications.verifiedAt,
          name: applications.name,
          phone: applications.phone,
          actAs: applications.actAs,
          location: applications.location,
          landArea: applications.landArea,
          north: applications.north,
          south: applications.south,
          east: applications.east,
          west: applications.west,
          createdAt: pkkpr.createdAt,
          title: pkkpr.title,
          type: pkkpr.type,
          status: pkkpr.status,
        })
        .from(fieldVerifications)
        .leftJoin(applications, eq(fieldVerifications.pkkprId, applications.pkkprId))
        .leftJoin(pkkpr, eq(fieldVerifications.pkkprId, pkkpr.id)) // LEFT JOIN agar pkkpr nullable sesuai tipe
        .where(and(...baseConditions));
    }

    // Execute the query
    const results = await query.execute();
    
    console.log("Raw query results:", results.length, "items"); // Debug log

    // TAMBAHAN: Debug lebih detail untuk melihat data createdAt
    if (results.length > 0) {
      console.log("Sample data:", results.slice(0, 2).map(item => ({
        id: item.id,
        pkkprId: item.pkkprId,
        createdAt: item.createdAt,
        createdAtType: typeof item.createdAt,
        year: item.createdAt ? new Date(item.createdAt).getFullYear() : 'null'
      })));
    }

    // PERBAIKAN: Tambahan filter di JavaScript sebagai backup
    let filteredResults = results;
    if (year && /^\d{4}$/.test(year)) {
      filteredResults = results.filter(item => {
        if (!item.createdAt) return false;
        const itemYear = new Date(item.createdAt).getFullYear().toString();
        return itemYear === year;
      });
      console.log("After JavaScript year filter:", filteredResults.length, "items for year", year);
    }

    // Validate and clean the results
    const validResults = filteredResults.filter(item => {
      const lat = parseFloat(item.latitude !== null ? String(item.latitude) : "NaN");
      const lng = parseFloat(item.longitude !== null ? String(item.longitude) : "NaN");
      
      // Check if coordinates are valid
      const isValid = !isNaN(lat) && !isNaN(lng) && 
                     lat >= -90 && lat <= 90 && 
                     lng >= -180 && lng <= 180 &&
                     !(lat === 0 && lng === 0);
      
      return isValid;
    });

    console.log("Valid results after filtering:", validResults.length, "items"); // Debug log

    // TAMBAHAN: Debug untuk melihat tahun dari data yang ditemukan
    if (validResults.length > 0) {
      const sampleYears = validResults.slice(0, 5).map(item => 
        item.createdAt ? new Date(item.createdAt).getFullYear() : 'null'
      );
      console.log("Sample years from results:", sampleYears); // Debug log
    }

    // Return GeoJSON format if requested
    if (format === 'geojson') {
      const geoJson = {
        type: "FeatureCollection",
        features: validResults.map(item => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(String(item.longitude)), parseFloat(String(item.latitude))]
          },
          properties: {
            id: item.id,
            pkkprId: item.pkkprId,
            name: item.name,
            phone: item.phone,
            location: item.location,
            landArea: item.landArea,
            actAs: item.actAs,
            isVerified: item.isVerified,
            verifiedAt: item.verifiedAt,
            createdAt: item.createdAt,
            title: item.title,
            type: item.type,
            status: item.status,
            boundaries: {
              north: item.north,
              south: item.south,
              east: item.east,
              west: item.west
            }
          }
        }))
      };

      const filterYear = year || new Date().getFullYear().toString();
      
      return new Response(JSON.stringify(geoJson, null, 2), {
        headers: { 
          "Content-Type": "application/geo+json",
          "Content-Disposition": `attachment; filename="map-data-${filterYear}.geojson"`,
          "Cache-Control": "public, max-age=300"
        },
      });
    }

    return new Response(JSON.stringify(validResults), {
      headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=300"
      },
    });

  } catch (error) {
    const isDev = process.env.NODE_ENV === 'development';
    
    console.error("API Error:", error); // Debug log
    
    return new Response(JSON.stringify({ 
      message: "Internal server error",
      error: isDev && error instanceof Error ? error.message : "An unexpected error occurred"
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};