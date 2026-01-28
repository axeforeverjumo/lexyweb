/**
 * Plantilla de Contrato de Compraventa de Vivienda
 * Conforme a Código Civil español (Arts. 1445 y siguientes)
 */

export interface DatosCompraventa {
  // Partes
  vendedor: {
    nombre: string;
    apellidos: string;
    dni: string;
    estado_civil: 'soltero' | 'casado' | 'viudo' | 'divorciado';
    domicilio: string;
  };
  comprador: {
    nombre: string;
    apellidos: string;
    dni: string;
    estado_civil: 'soltero' | 'casado' | 'viudo' | 'divorciado';
    domicilio: string;
  };

  // Inmueble
  inmueble: {
    tipo: 'vivienda' | 'local' | 'garaje' | 'trastero';
    direccion_completa: string;
    codigo_postal: string;
    municipio: string;
    provincia: string;
    referencia_catastral: string;
    superficie_util: number;
    superficie_construida: number;
    descripcion?: string;
  };

  // Económico
  precio_total: number;
  forma_pago: 'contado' | 'financiado';
  arras_entregadas?: number;
    fecha_entrega_arras?: string;

  // Fechas
  lugar_firma: string;
  fecha_firma: string;
  fecha_entrega_llaves?: string;

  // Opcionales
  cargas_gravamenes: boolean;
  descripcion_cargas?: string;
  gastos_e_impuestos: 'comprador' | 'vendedor' | 'mitad';
}

export const generarContratoCompraventa = (datos: DatosCompraventa): string => {
  const { vendedor, comprador, inmueble, precio_total, lugar_firma, fecha_firma } = datos;

  // Formatear precio en texto
  const precioEnTexto = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(precio_total);

  return `# CONTRATO PRIVADO DE COMPRAVENTA DE VIVIENDA

En **${lugar_firma}**, a **${new Date(fecha_firma).toLocaleDateString('es-ES', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})}**.

## REUNIDOS

**DE UNA PARTE:**

Don/Doña **${vendedor.nombre} ${vendedor.apellidos}**, mayor de edad, con DNI número **${vendedor.dni}**, estado civil **${vendedor.estado_civil}**, y domicilio en **${vendedor.domicilio}**.

En adelante, **LA PARTE VENDEDORA**.

**DE OTRA PARTE:**

Don/Doña **${comprador.nombre} ${comprador.apellidos}**, mayor de edad, con DNI número **${comprador.dni}**, estado civil **${comprador.estado_civil}**, y domicilio en **${comprador.domicilio}**.

En adelante, **LA PARTE COMPRADORA**.

Ambas partes se reconocen mutuamente la capacidad legal necesaria para otorgar el presente contrato y, en su virtud,

## EXPONEN

**PRIMERO.-** Que LA PARTE VENDEDORA es propietaria en pleno dominio de la siguiente finca:

**Descripción de la finca:**
- **Tipo:** ${inmueble.tipo}
- **Dirección:** ${inmueble.direccion_completa}, ${inmueble.codigo_postal} ${inmueble.municipio}, ${inmueble.provincia}
- **Referencia catastral:** ${inmueble.referencia_catastral}
- **Superficie útil:** ${inmueble.superficie_util} m²
- **Superficie construida:** ${inmueble.superficie_construida} m²
${inmueble.descripcion ? `- **Descripción:** ${inmueble.descripcion}` : ''}

**SEGUNDO.-** Que LA PARTE VENDEDORA manifiesta que la finca descrita se encuentra libre de cargas, gravámenes, arrendatarios, ocupantes, y condiciones resolutorias${datos.cargas_gravamenes ? ', SALVO: ' + datos.descripcion_cargas : ''}, y que no existe sobre la misma ningún impedimento, carga o limitación de dominio que pueda impedir su libre disposición.

**TERCERO.-** Que ambas partes están interesadas en perfeccionar un contrato de compraventa sobre la finca descrita, en los términos y condiciones que se establecen en las siguientes

## ESTIPULACIONES

### PRIMERA.- Objeto del contrato

Por medio del presente contrato, LA PARTE VENDEDORA vende a LA PARTE COMPRADORA, quien compra, la finca descrita en el expositivo PRIMERO, con todo lo accesorio y lo adherido a la misma, sin reserva ni limitación alguna.

*Base legal: Arts. 1445, 1461 y 1462 del Código Civil.*

### SEGUNDA.- Precio

El precio de la compraventa se fija en la cantidad de **${precioEnTexto} (${precio_total}€)**, que LA PARTE COMPRADORA declara haber entregado a LA PARTE VENDEDORA${datos.arras_entregadas ? `, de los cuales ${datos.arras_entregadas}€ fueron entregados en concepto de arras confirmatorias el día ${datos.fecha_entrega_arras}` : ''}.

LA PARTE VENDEDORA otorga el más eficaz recibo y carta de pago de dicha cantidad.

*Base legal: Art. 1445 del Código Civil.*

### TERCERA.- Forma de pago

El pago del precio se realizará de la siguiente forma:

${datos.forma_pago === 'contado' ?
`- **Al contado:** La totalidad del precio se abona en el acto de firma del presente contrato mediante transferencia bancaria.` :
`- **Financiado:** Mediante préstamo hipotecario a conceder por entidad financiera. En caso de denegación del préstamo, el presente contrato quedará resuelto sin indemnización para ninguna de las partes, devolviendo LA PARTE VENDEDORA las cantidades recibidas.`}

### CUARTA.- Transmisión de la propiedad

La propiedad de la finca se transmitirá a LA PARTE COMPRADORA en el momento de la elevación a escritura pública del presente contrato ante Notario.

Hasta ese momento, LA PARTE VENDEDORA conservará la propiedad y posesión de la finca, respondiendo de su conservación y mantenimiento.

*Base legal: Arts. 609 y 1095 del Código Civil.*

### QUINTA.- Entrega de la posesión

LA PARTE VENDEDORA se compromete a entregar la posesión material de la finca a LA PARTE COMPRADORA${datos.fecha_entrega_llaves ? ` el día ${new Date(datos.fecha_entrega_llaves).toLocaleDateString('es-ES')}` : ' en el plazo de 15 días desde la firma de la escritura pública'}, completamente libre de personas, muebles y enseres, salvo aquellos que expresamente se hubieren pactado.

### SEXTA.- Elevación a escritura pública

Las partes se comprometen a elevar el presente contrato a escritura pública ante Notario en el plazo máximo de **30 días** desde la fecha del presente documento, salvo acuerdo expreso en contrario.

Los gastos e impuestos inherentes a la compraventa serán de cuenta de **${datos.gastos_e_impuestos === 'comprador' ? 'LA PARTE COMPRADORA' : datos.gastos_e_impuestos === 'vendedor' ? 'LA PARTE VENDEDORA' : 'ambas partes por mitad'}**, incluyendo:

- Impuesto sobre Transmisiones Patrimoniales (ITP) o IVA según corresponda
- Gastos de Notaría
- Gastos de Registro de la Propiedad
- Impuesto sobre el Incremento del Valor de los Terrenos de Naturaleza Urbana (Plusvalía Municipal)

*Base legal: Arts. 1455 y 1465 del Código Civil.*

### SÉPTIMA.- Saneamiento por evicción y vicios ocultos

LA PARTE VENDEDORA responderá frente a LA PARTE COMPRADORA del saneamiento por evicción y vicios ocultos de la finca vendida, en los términos establecidos en los artículos 1474 y siguientes del Código Civil.

LA PARTE VENDEDORA garantiza que la finca se encuentra en perfecto estado de conservación y habitabilidad, sin defectos estructurales ni vicios ocultos que impidan su uso normal.

*Base legal: Arts. 1474-1499 del Código Civil.*

### OCTAVA.- Comunidad de Propietarios

LA PARTE VENDEDORA declara estar al corriente en el pago de los gastos de la Comunidad de Propietarios, comprometiéndose a entregar el certificado acreditativo en el momento de la firma de la escritura pública.

Los gastos de comunidad se prorratearán entre vendedor y comprador hasta la fecha de la entrega de llaves.

*Base legal: Ley de Propiedad Horizontal 49/1960.*

### NOVENA.- Certificaciones energéticas y administrativas

LA PARTE VENDEDORA entrega a LA PARTE COMPRADORA:

- Certificado de Eficiencia Energética en vigor
- Cédula de Habitabilidad (según normativa autonómica aplicable)
- Nota Simple del Registro de la Propiedad actualizada

### DÉCIMA.- Arras

${datos.arras_entregadas ?
`Las arras entregadas por importe de ${datos.arras_entregadas}€ tienen carácter de **arras confirmatorias**, conforme al artículo 1454 del Código Civil, y se imputarán al precio total de la compraventa.` :
`No se han entregado arras.`}

### UNDÉCIMA.- Resolución contractual

En caso de incumplimiento de cualquiera de las obligaciones derivadas del presente contrato, la parte cumplidora podrá optar entre:

a) Exigir el cumplimiento del contrato, más la indemnización de daños y perjuicios.
b) Resolver el contrato con devolución de las cantidades entregadas e indemnización de daños y perjuicios.

*Base legal: Art. 1124 del Código Civil.*

### DUODÉCIMA.- Protección de datos

Los datos personales recabados en este contrato serán tratados conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 de Protección de Datos, exclusivamente para la gestión de la presente compraventa.

### DECIMOTERCERA.- Legislación aplicable y jurisdicción

El presente contrato se rige por la legislación española. Para cualquier controversia derivada del mismo, las partes se someten a los Juzgados y Tribunales de **${inmueble.municipio}**, renunciando expresamente a cualquier otro fuero que pudiera corresponderles.

---

Y en prueba de conformidad, ambas partes firman el presente contrato por duplicado ejemplar en el lugar y fecha indicados en el encabezamiento.

**LA PARTE VENDEDORA**

_________________________
Fdo.: ${vendedor.nombre} ${vendedor.apellidos}
DNI: ${vendedor.dni}

**LA PARTE COMPRADORA**

_________________________
Fdo.: ${comprador.nombre} ${comprador.apellidos}
DNI: ${comprador.dni}

---

*Documento generado con LexyApp - Plataforma Legal Profesional*
*Este contrato tiene carácter privado y debe ser elevado a escritura pública ante Notario para su plena eficacia registral.*
`;
};

export default generarContratoCompraventa;
