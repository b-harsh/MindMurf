const detectLangCode = async (text) => {
  const { franc } = await import('franc');

  const langMap = {
    hin: 'hi',
    ben: 'bn',
    tam: 'ta',
    mar: 'mr',
    eng: 'en',
  };

  const iso = franc(text);
  return langMap[iso] || 'en';
};

module.exports = { detectLangCode };
