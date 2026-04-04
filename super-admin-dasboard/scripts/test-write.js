import { writeFileSync, mkdirSync } from "fs";
mkdirSync("/home/user/app", { recursive: true });
writeFileSync("/home/user/test.txt", "hello world", "utf8");
console.log("Write succeeded!");
