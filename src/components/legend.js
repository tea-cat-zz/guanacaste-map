export default allLayers =>
  `<div>
	    <h4 class="overlay-box">Puestos Estaciónes y Tourismos</h4>
			<div id="legend-items" class="overlay-box">
          ${allLayers
            .map(
              layer => `<div class="legend-item active" id="${layer.name}" onClick="handleFilter('${
                layer.name
              }', '${layer.type || 'symbol'}', ${layer.layerId ? `'${layer.layerId}'` : null})">
                  <span class="legend-key" style="background-color: ${layer.color}"></span>
                  <span class="label">${layer.label}</span>
                </div>`
            )
            .join('')}

			</div>
      <div id="legend-footer" class="overlay-box">
        <div onClick="noFilter()">Ver Todas las Capas</div>
      </div>
	</div>`;
