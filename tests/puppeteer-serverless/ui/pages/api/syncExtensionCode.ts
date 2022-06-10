export default function handler(req, res) {
    const execSync = require("child_process").execSync;

    execSync(
        `rm -r ./extension && cp -r ../../../distribution ./extension &&
        tmp=$(mktemp) && jq '.content_scripts[0].js[0] = "content-script/enhance.js" | .content_scripts[0].run_at = "document_idle"' ./extension/manifest.json > "$tmp" && mv "$tmp" ./extension/manifest.json &&
        zip -r extension.zip extension &&
        gsutil cp extension.zip gs://unclutter-screenshots-serverless/extension.zip
        `
    );

    res.status(200).send("ok");
}