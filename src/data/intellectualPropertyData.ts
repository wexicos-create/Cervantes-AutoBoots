export interface LegalClause {
  number: number;
  title: string;
  shortSummary: string;
  fullText: string;
  highlights: string[];
  icon: string;
}

export const INTELLECTUAL_PROPERTY_CHARTER = {
  title: 'PROPIEDAD INTELECTUAL Y USO DEL CONTENIDO GENERADO',
  author: 'Josue Israel Cervantes Alvarado',
  manifestoSummary:
    'Buscamos empoderar sociedad y descentralizar el control tecnológico en manos de élites de inteligencia artificial y buscando que tu trabajo sea privado lo más posible.',
  clauses: [
    {
      number: 1,
      title: 'Propiedad del Software y los Bots',
      shortSummary: 'El Desarrollador comparte la autoría y derecho de propiedad de la herramienta con el Usuario.',
      fullText:
        'El Desarrollador Josue Israel Cervantes Alvarado es el propietario pero el usuario o quien modifique este programa sin perder de vista los valores de empoderar sociedad no élites tecnológicas, compartimos la autoría con quien lo adopte o quien use la herramienta sin publicarla adquiere la autoría en resultados de código mediante el uso de esta herramienta. El uso de este software estrictamente comparte con Josué Israel Cervantes Alvarado derecho de propiedad sobre la herramienta al Usuario.',
      highlights: [
        'Propiedad compartida con el Usuario orientada a empoderar a la sociedad, no a élites tecnológicas.',
        'Quien adopte o use la herramienta adquiere plena autoría en los resultados de código.',
        'Uso del software transfiere y comparte derechos sobre la herramienta con el Desarrollador.',
      ],
      icon: 'ShieldCheck',
    },
    {
      number: 2,
      title: 'Propiedad del Código Generado (Output)',
      shortSummary: 'Cero retención de derechos. Cede el 100% de la titularidad del código al Usuario libre de regalías.',
      fullText:
        'El Desarrollador no se apropia, no reclama derechos, ni retiene ninguna titularidad sobre las líneas de código independientes generadas por los bots a petición del Usuario. En la medida en que lo permita la ley aplicable, el Desarrollador cede y transfiere cualquier derecho resultante al Usuario para que este pueda utilizarlo, modificarlo o comercializarlo libremente y sin tener que pagar regalías.',
      highlights: [
        'El Desarrollador no reclama derechos ni regalías sobre el código resultante.',
        'El Usuario puede comercializar, monetizar, modificar y usar el código libremente.',
        'Cesión total y transferencia íntegra de derechos del output al Usuario.',
      ],
      icon: 'FileCode',
    },
    {
      number: 3,
      title: 'Advertencia Legal sobre la Autoría (Derechos de Autor)',
      shortSummary: 'Intervención humana para protección legal. Garantía de no almacenamiento de resultados.',
      fullText:
        'El Usuario reconoce que las leyes internacionales de propiedad intelectual generalmente exigen la autoría humana para otorgar derechos de autor. Dado que el código entregado es un producto automatizado por un software (los bots) y se entrega en fragmentos sueltos, el código bruto generado podría ser considerado de dominio público por las autoridades legales. El Desarrollador no garantiza que el código generado de forma automatizada sea registrable ante las oficinas de patentes o derechos de autor, pero sí garantizamos el no almacenamiento de resultados y no se nutre con datos de usuarios.\n\nLa protección legal del software final dependerá exclusivamente de la intervención humana, ensamble y modificaciones significativas que el Usuario realice posteriormente por su cuenta.',
      highlights: [
        'Garantía total de no almacenamiento de resultados de usuario.',
        'No nutrición de bases de datos externas con la labor del desarrollador.',
        'La autoría humana y el ensamble propio otorgan la plena protección jurídica final.',
      ],
      icon: 'AlertCircle',
    },
    {
      number: 4,
      title: 'Gratuidad y Optimización de Costos',
      shortSummary: 'Software 100% gratuito optimizado para eliminar infraestructura costosa masiva.',
      fullText:
        'Este software se ofrece de forma completamente gratuita. El modelo de automatización implementado ha sido diseñado con un enfoque de optimización de procesos que elimina costos operativos de infraestructura masiva, permitiendo ofrecer el servicio sin cargos para el Usuario.',
      highlights: [
        '100% Gratuito y sin cargos ocultos ni suscripciones.',
        'Arquitectura optimizada que elimina dependencias de servidores masivos de pago.',
        'Democratización y acceso universal a la programación automatizada.',
      ],
      icon: 'Sparkles',
    },
    {
      number: 5,
      title: 'Privacidad Absoluta: No Almacenamiento y No Entrenamiento',
      shortSummary: 'Cero retención en servidores y cero entrenamiento con prompts o código del usuario.',
      fullText:
        'Para garantizar la máxima confidencialidad y soberanía tecnológica del Usuario, el software opera bajo las siguientes estrictas reglas de privacidad:\n\n* Sin almacenamiento de datos: El software no almacena, guarda ni registra en ningún servidor externo la información, instrucciones (prompts) o códigos generados por el Usuario. Todo el procesamiento ocurre en tiempo real y desaparece una vez cerrada la sesión.\n\n* Sin entrenamiento de modelos: El Desarrollador no utiliza los datos, códigos ni consultas del Usuario para entrenar, mejorar o refinar los algoritmos de los bots ni de "llama Inteligencia Artificial" al ser local. Tu conocimiento y tu trabajo permanecen 100% privados y te pertenecen en cuanto a nuestras capacidades.',
      highlights: [
        'Sin almacenamiento: Todo el procesamiento ocurre en tiempo real y desaparece al terminar la sesión.',
        'Sin entrenamiento de modelos: Tus prompts y tu código jamás nutren modelos comerciales ni locales.',
        'Soberanía tecnológica total: Tu conocimiento permanece 100% privado.',
      ],
      icon: 'Lock',
    },
    {
      number: 6,
      title: 'Ausencia de Alucinaciones',
      shortSummary: 'Reglas lógicas deterministas sin datos inventados. Requisito de conservación de créditos del autor.',
      fullText:
        'Los bots han sido programados mediante reglas lógicas estrictas para la generación de código técnico concreto. El software no realiza interpretaciones abstractas ni "alucinaciones" (generación de datos falsos o inventados). Sin embargo, el código se entrega "tal cual", y es responsabilidad exclusiva del Usuario revisar la sintaxis y el correcto funcionamiento lógico antes de implementarlo en entornos de producción. También estrictamente se solicita que se conserve el nombre de el autor, se puede mencionar como colaborador si se utiliza este código siempre y cuando no se descarte el nombre de autor de derivados de este programa.',
      highlights: [
        'Generación basada en lógica algorítmica y sintaxis determinista, no en datos inventados.',
        'Entrega "tal cual" con recomendación de validación técnica previa a producción.',
        'Obligación de conservar el crédito de Josue Israel Cervantes Alvarado en derivados y colaboraciones.',
      ],
      icon: 'Bot',
    },
  ],
  closingManifesto:
    'Buscamos empoderar sociedad y descentralizar el control tecnológico en manos de élites de inteligencia artificial y buscando que tu trabajo sea privado lo más posible.',
};

export const generateFullLegalCharterDocument = (): string => {
  let doc = `================================================================================
${INTELLECTUAL_PROPERTY_CHARTER.title}
Autor Principal: ${INTELLECTUAL_PROPERTY_CHARTER.author}
Fecha de Emisión: ${new Date().toISOString().split('T')[0]}
================================================================================

${INTELLECTUAL_PROPERTY_CHARTER.manifestoSummary}

--------------------------------------------------------------------------------
CLÁUSULAS FORMALES DE PROPIEDAD INTELECTUAL Y TÉRMINOS DE USO:
--------------------------------------------------------------------------------
`;

  INTELLECTUAL_PROPERTY_CHARTER.clauses.forEach((clause) => {
    doc += `\n${clause.number}. ${clause.title.toUpperCase()}\n`;
    doc += `--------------------------------------------------------------------------------\n`;
    doc += `${clause.fullText}\n`;
  });

  doc += `\n================================================================================
DECLARACIÓN DE PRINCIPIOS:
${INTELLECTUAL_PROPERTY_CHARTER.closingManifesto}

Créditos y Atribución Obligatoria: Josue Israel Cervantes Alvarado
================================================================================\n`;

  return doc;
};
