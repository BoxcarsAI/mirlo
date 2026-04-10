import { defineConfig } from "wxt";

export default defineConfig({
  srcDir: "src",
  manifest: {
    name: "__MSG_appName__",
    description: "__MSG_appDesc__",
    default_locale: "en",
    permissions: ["activeTab", "storage"],
    action: {
      default_title: "__MSG_actionTitle__",
      default_icon: {
        "16": "assets/mirlo-16.png",
        "32": "assets/mirlo-32.png",
        "48": "assets/mirlo-48.png",
        "128": "assets/mirlo-128.png",
      },
    },
    icons: {
      "16": "assets/mirlo-16.png",
      "32": "assets/mirlo-32.png",
      "48": "assets/mirlo-48.png",
      "128": "assets/mirlo-128.png",
    },
    options_ui: {
      open_in_tab: true,
    },
  },
});
