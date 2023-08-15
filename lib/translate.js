

const loadTranslation = async () => {
  return await fetch('/translations.json').then(resp => resp.json());
};

export const translate = async (string, args) => {
  const i18n = await loadTranslation();
  let value = get(i18n, string);

  eachRight(args, (paramVal, paramKey) => {
    value = replace(value, `:${paramKey}`, paramVal);
  });
  return value;
};

export default translate;