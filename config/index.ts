const prodServer = "https://web-prod.bpce-bpri-prod-web2.nfrance.net";
const devServer = "http://localhost:8888";
const prodProjectPath = "";

const isProd = process.env.NODE_ENV === "production";
export const basePath = isProd ? "" : "";

export const API_URL = isProd
  ? `${prodServer}/${prodProjectPath}`
  : `${devServer}`;
