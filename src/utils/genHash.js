// genHash.js
import bcrypt from "bcrypt";

async function generate() {
    const password = "nithya123"; // change this
    const saltRounds = 12; // 10 or 12 recommended

    try {
        const hash = await bcrypt.hash(password, saltRounds);
        console.log("Hashed password:\n", hash);
    } catch (err) {
        console.error(err);
    }

    const match = await bcrypt.compare(
        password,
        "$2b$12$icTIr1jmtqgLybcbOOF3T.vGNuJyGfuOigJMCfCdIm5HWcEHSSR3K",
    );
    console.log(match);
}

generate();
