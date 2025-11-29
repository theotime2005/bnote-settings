/**
 * Export utilities for B.note configurations
 */

/**
 * Exports a configuration in JSON format
 */
export function exportToJSON(config, filename = "bnote-settings") {
  try {
    const jsonString = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.bnote`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'export JSON:", error);
    return false;
  }
}

/**
 * Exporte une configuration au format CSV (pour analyse)
 */
export function exportToCSV(config, filename = "bnote-settings-analysis") {
  try {
    const rows = [["Section", "Paramètre", "Valeur", "Type"]];

    for (const [section, settings] of Object.entries(config)) {
      for (const [key, value] of Object.entries(settings)) {
        rows.push([section, key, String(value), typeof value]);
      }
    }

    const csvContent = rows.map(row =>
      row.map(cell => `"${String(cell).replace(/"/g, "\"\"")}"`).join(","),
    ).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'export CSV:", error);
    return false;
  }
}

/**
 * Génère un rapport de configuration lisible
 */
export function generateConfigReport(config, settingsSchema, translations) {
  const report = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: "1.0",
      totalSections: Object.keys(config).length,
      totalSettings: Object.values(config).reduce((acc, section) => acc + Object.keys(section).length, 0),
    },
    sections: {},
  };

  for (const [sectionKey, settings] of Object.entries(config)) {
    const sectionName = translations?.[`settings.id.${sectionKey}`] || sectionKey;
    report.sections[sectionName] = {
      key: sectionKey,
      settings: {},
    };

    for (const [settingKey, value] of Object.entries(settings)) {
      const settingName = translations?.[`settings.id.${settingKey}`] || settingKey;
      const schema = settingsSchema[sectionKey]?.[settingKey];

      report.sections[sectionName].settings[settingName] = {
        key: settingKey,
        value,
        type: schema?.type || "unknown",
        isDefault: value === schema?.default,
        default: schema?.default,
      };
    }
  }

  return report;
}

/**
 * Exporte un rapport de configuration au format texte
 */
export function exportConfigReport(config, settingsSchema, translations, filename = "bnote-config-report") {
  try {
    const report = generateConfigReport(config, settingsSchema, translations);

    let content = "# Rapport de Configuration B.note\n\n";
    content += `Généré le: ${new Date(report.metadata.generatedAt).toLocaleString()}\n`;
    content += `Sections: ${report.metadata.totalSections}\n`;
    content += `Paramètres: ${report.metadata.totalSettings}\n\n`;

    for (const [sectionName, section] of Object.entries(report.sections)) {
      content += `## ${sectionName}\n\n`;

      for (const [settingName, setting] of Object.entries(section.settings)) {
        const status = setting.isDefault ? "🔹 (défaut)" : "🔸 (modifié)";
        content += `- **${settingName}**: ${setting.value} ${status}\n`;
      }

      content += "\n";
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error("Erreur lors de l'export du rapport:", error);
    return false;
  }
}