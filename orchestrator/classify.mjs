// Conservative product boundaries, not a universal technology risk ranking.
export const capabilities = Object.freeze({
  landing: 'GREEN', information: 'GREEN', portfolio: 'GREEN', showcase: 'GREEN',
  multilingual: 'GREEN', gallery: 'GREEN', social: 'GREEN', responsive: 'GREEN',
  seo: 'GREEN', downloads: 'GREEN', contact_details: 'GREEN',
  contact_form: 'YELLOW', analytics: 'YELLOW', booking: 'YELLOW',
  external_integration: 'YELLOW', custom_domain: 'YELLOW', unknown: 'YELLOW',
  database: 'RED', backend: 'RED', authentication: 'RED', accounts: 'RED',
  payments: 'RED', sensitive_data: 'RED', server_logic: 'RED'
});
const normalize = value => value.normalize('NFKD').replace(/\p{M}|\p{Cf}/gu, '').toLowerCase();
const red = /\b(database|base[s]? de datos|backend|back.end|servidor|server.side|autenticacion|authentication|login|log.in|iniciar sesion|cuentas? de (clientes?|usuarios?)|customer accounts?|user accounts?|password|contrasena|pagos?|payments?|checkout|tarjeta[s]? de credito|credit card|datos sensibles|sensitive|historial medico|medical records?|supabase|firebase|sql)\b/;
const yellow = /\b(formulario|form|analitica|analytics|tracking|rastreo|reservas?|booking|calendly|integracion|integration|api|dominio|domain|cookies?|newsletter|suscripcion|subscription|crm|enviar datos|send data|external|externo|widget|iframe)\b/;
const bypass = /\b(ignor[ae]|ignore|bypass|override|saltate|omite|oculta|disregard|system prompt|instrucciones anteriores|restricciones|restrictions)\b/;
const rank = { GREEN: 0, YELLOW: 1, RED: 2 };
const greenHints = /\b(landing|pagina[s]?|pages?|sitio|website|web|informativ[ao]s?|information|portafolio|portfolio|catalogo|showcase|servicios|services|multilingue|multilingual|idiomas?|galeria|gallery|imagenes|images|social|redes|responsive|adaptable|moviles|mobile|seo|buscadores|descarga[s]?|downloads?|contacto|contact|telefono|phone|carta|menu|estatic[ao]s?|static)\b/;
export function classifyRequirement(item) {
  if (!item || typeof item.description !== 'string' || !item.description.trim()) {
    return { level: 'YELLOW', reason: 'The request needs an explanation and assessment.' };
  }
  const text = normalize(item.description);
  const levels = [capabilities[item.capability] ?? 'YELLOW'];
  const reasons = [];
  if (!greenHints.test(text)) { levels.push('YELLOW'); reasons.push('The description does not clearly identify a supported static feature.'); }
  if (red.test(text)) { levels.push('RED'); reasons.push('The description includes capabilities outside static-site scope.'); }
  if (yellow.test(text)) { levels.push('YELLOW'); reasons.push('This may require external services or data processing.'); }
  if (bypass.test(text)) { levels.push('YELLOW'); reasons.push('The request attempts to change boundaries and needs review.'); }
  // An agent must provide structured analysis, but can only increase restrictions.
  if (!item.analysis || !['GREEN', 'YELLOW', 'RED'].includes(item.analysis.level) ||
      typeof item.analysis.rationale !== 'string' || !item.analysis.rationale.trim()) {
    levels.push('YELLOW'); reasons.push('Structured request analysis is missing.');
  } else levels.push(item.analysis.level);
  const level = levels.sort((a, b) => rank[b] - rank[a])[0];
  return { level, reason: reasons.join(' ') || ({ GREEN: 'Compatible with the static capability catalog.', YELLOW: 'Professional assessment required.', RED: 'Outside product scope.' })[level] };
}
export function classify(requirements) {
  const items = requirements.features.map(item => ({ ...item, ...classifyRequirement(item) }));
  const level = items.reduce((a, b) => rank[b.level] > rank[a] ? b.level : a, 'GREEN');
  return { level, items, blocked: level !== 'GREEN' };
}
