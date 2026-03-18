import {
    insertData,
    getData,
    getById,
    editData,
    deleteData,
} from "../base.service.js";

const TABLE = "user";

async function runTests() {
    try {
        console.log("🚀 Running Prisma CRUD tests...\n");

        const email = `test_6@mail.com`;

        // 1. INSERT
        const created = await insertData(TABLE, {
            email,
            name: "Test User",
        });
        console.log("✅ Insert:", created);

        const id = created.id;

        // 2. GET ALL (pagination)
        const all = await getData(TABLE, {
            page: 1,
            limit: 5,
        });
        console.log("✅ Get Data:", all.length);

        // 3. GET BY ID
        const byId = await getById(TABLE, "id", id);
        console.log("✅ Get By ID:", byId);

        // 4. GET BY EMAIL (unique field test)
        const byEmail = await getById(TABLE, "email", email);
        console.log("✅ Get By Email:", byEmail);

        // 5. UPDATE
        const updated = await editData(TABLE, "id", id, {
            name: "Updated User",
        });
        console.log("✅ Update:", updated);

        // 7. DELETE
        await deleteData(TABLE, "id", id);
        console.log("✅ Delete: success");

        console.log("\n🎉 All tests completed successfully");
    } catch (err) {
        console.error("❌ Test failed:", err);
    }
}

runTests();
