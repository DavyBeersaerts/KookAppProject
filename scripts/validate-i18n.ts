import { TRANSLATIONS } from "../lib/constants";

function validateTranslations() {
  console.log("🔍 Validating translations...\n");

  const languages = Object.keys(TRANSLATIONS) as Array<keyof typeof TRANSLATIONS>;
  const allKeys = new Set<string>();
  const errors: string[] = [];
  const warnings: string[] = [];

  languages.forEach((lang) => {
    Object.keys(TRANSLATIONS[lang]).forEach((key) => allKeys.add(key));
  });

  console.log(`Found ${allKeys.size} translation keys across ${languages.length} languages\n`);

  languages.forEach((lang) => {
    const langKeys = new Set(Object.keys(TRANSLATIONS[lang]));
    const missingKeys = Array.from(allKeys).filter((key) => !langKeys.has(key));

    if (missingKeys.length > 0) {
      errors.push(`❌ Language "${lang}" is missing ${missingKeys.length} keys:`);
      missingKeys.forEach((key) => {
        errors.push(`   - ${key}`);
      });
      errors.push("");
    } else {
      console.log(`✅ Language "${lang}": All ${allKeys.size} keys present`);
    }
  });

  const referenceKeys = Object.keys(TRANSLATIONS.en);
  languages.forEach((lang) => {
    if (lang === "en") return;

    Object.entries(TRANSLATIONS[lang]).forEach(([key, value]) => {
      if (value === TRANSLATIONS.en[key as keyof typeof TRANSLATIONS.en]) {
        warnings.push(`⚠️  Language "${lang}" key "${key}" has same value as English: "${value}"`);
      }
    });
  });

  console.log("\n" + "=".repeat(60));

  if (errors.length > 0) {
    console.log("\n❌ ERRORS FOUND:\n");
    errors.forEach((error) => console.log(error));
  }

  if (warnings.length > 0) {
    console.log("\n⚠️  WARNINGS:\n");
    warnings.forEach((warning) => console.log(warning));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log("\n✅ All translations are valid!");
  }

  console.log("\n" + "=".repeat(60));

  if (errors.length > 0) {
    console.log("\n❌ Validation failed!");
    process.exit(1);
  } else {
    console.log("\n✅ Validation passed!");
    process.exit(0);
  }
}

validateTranslations();
