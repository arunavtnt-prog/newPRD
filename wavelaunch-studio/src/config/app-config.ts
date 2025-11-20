import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Wavelaunch Studio",
  version: packageJson.version,
  copyright: `© ${currentYear}, Wavelaunch Studio.`,
  meta: {
    title: "Wavelaunch Studio - Brand Development Platform",
    description:
      "Wavelaunch Studio is a comprehensive project management and asset generation platform designed to streamline the creator brand development process from 24+ weeks to 16-20 weeks.",
  },
};
