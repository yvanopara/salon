// backend/config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dtux31kgr",
  api_key: "615351161596297",
  api_secret: "2XcGok99m0Ttmaghqf4Nz7kUZlY",
});

export default cloudinary; // ← ici on exporte l'instance prête à l'emploi
