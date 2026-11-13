/**
 * Portafolio API - consumo de JSON Server desde WordPress.
 *
 * El plugin (portafolio-api.php) imprime contenedores como:
 *   <div class="portafolio-contenedor" id="portafolio-habilidades" data-recurso="habilidades">
 * y pasa la URL de la API en el objeto global PortafolioAPI.apiUrl.
 * Este script lee data-recurso, pide ese endpoint con fetch y dibuja el resultado.
 */
document.addEventListener('DOMContentLoaded', function () {
  // ---------- Configuración ----------

  // URL base inyectada por wp_localize_script (con valor de respaldo)
  var API_URL = (
    (window.PortafolioAPI && window.PortafolioAPI.apiUrl) ||
    'http://localhost:3000'
  ).replace(/\/+$/, '');

  // ---------- Utilidades ----------

  // Escapa texto para no inyectar HTML desde los datos
  function esc(txt) {
    return String(txt == null ? '' : txt).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // Convierte "En desarrollo" -> "en-desarrollo", "Básico" -> "basico"
  // (sirve para generar nombres de clase CSS seguros)
  function slug(txt) {
    return String(txt == null ? '' : txt)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-');
  }

  // GET a un endpoint de JSON Server, validando la respuesta HTTP
  async function obtener(endpoint) {
    var resp = await fetch(API_URL + '/' + endpoint);
    if (!resp.ok) {
      throw new Error('Error HTTP ' + resp.status);
    }
    return resp.json();
  }

  // Mensaje amigable cuando la API no responde (requisito del enunciado)
  function mostrarError(contenedor) {
    contenedor.innerHTML =
      '<div class="portafolio-error" role="alert">' +
      'No se pudo cargar la información en este momento. ' +
      'Por favor, intenta nuevamente más tarde.' +
      '</div>';
  }

  // Mensaje cuando la API responde pero no hay datos
  function mostrarVacio(contenedor) {
    contenedor.innerHTML =
      '<p class="portafolio-vacio">No hay información disponible por el momento.</p>';
  }

  // ---------- Renderizado ----------

  // Lista con badges de nivel
  function renderHabilidades(datos, contenedor) {
    contenedor.innerHTML =
      '<ul class="portafolio-lista">' +
      datos.map(function (h) {
        return (
          '<li class="portafolio-habilidad">' +
            '<span class="habilidad-nombre">' + esc(h.nombre) + '</span>' +
            '<span class="badge badge-' + slug(h.nivel) + '">' + esc(h.nivel) + '</span>' +
            '<small class="habilidad-categoria">' + esc(h.categoria) + '</small>' +
          '</li>'
        );
      }).join('') +
      '</ul>';
  }

  // Tarjetas con nombre y descripción
  function renderIntereses(datos, contenedor) {
    contenedor.innerHTML =
      '<div class="portafolio-tarjetas">' +
      datos.map(function (i) {
        return (
          '<article class="tarjeta tarjeta-interes">' +
            '<h3>' + esc(i.nombre) + '</h3>' +
            '<p>' + esc(i.descripcion) + '</p>' +
          '</article>'
        );
      }).join('') +
      '</div>';
  }

  // Tarjetas con tecnologías y estado
  function renderProyectos(datos, contenedor) {
    contenedor.innerHTML =
      '<div class="portafolio-tarjetas">' +
      datos.map(function (p) {
        var techs = (p.tecnologias || []).map(function (t) {
          return '<li>' + esc(t) + '</li>';
        }).join('');
        return (
          '<article class="tarjeta tarjeta-proyecto">' +
            '<h3>' + esc(p.nombre) + '</h3>' +
            '<p>' + esc(p.descripcion) + '</p>' +
            '<ul class="tecnologias">' + techs + '</ul>' +
            '<span class="estado estado-' + slug(p.estado) + '">' + esc(p.estado) + '</span>' +
          '</article>'
        );
      }).join('') +
      '</div>';
  }

  // ---------- Inicialización ----------

  // recurso (data-recurso) -> función que lo dibuja
  var renderers = {
    habilidades: renderHabilidades,
    intereses: renderIntereses,
    proyectos: renderProyectos
  };

  // Recorre todos los contenedores que haya en la página
  document.querySelectorAll('.portafolio-contenedor').forEach(async function (contenedor) {
    var recurso = contenedor.dataset.recurso;
    var render = renderers[recurso];
    if (!render) return; // recurso desconocido

    try {
      var datos = await obtener(recurso);
      if (!Array.isArray(datos) || datos.length === 0) {
        mostrarVacio(contenedor);
        return;
      }
      render(datos, contenedor);
    } catch (err) {
      console.error('Fallo al cargar ' + recurso + ':', err);
      mostrarError(contenedor);
    }
  });
});