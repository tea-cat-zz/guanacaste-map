export default allLayers =>
  `<div id="legend-inner" class="flex-child">
	    <h4 class="overlay-box toggle-button" onClick="tcat.toggleLegend()">Puestos Estaciónes y Tourismos</h4>
			<div id="legend-items" class="overlay-box toggle-content">
          ${allLayers
            .map(
              layer => `<div class="legend-item active" id="${
                layer.name
              }" onClick="tcat.handleFilter('${layer.name}', '${layer.type || 'symbol'}', ${
                layer.layerId ? `'${layer.layerId}'` : null
              })">
                  <span class="legend-key" style="background-color: ${layer.color}"></span>
                  <span class="label">${layer.label}</span>
                </div>`
            )
            .join('')}

			</div>
      <div id="legend-footer" class="overlay-box toggle-content">
        <div onClick="tcat.noFilter()">Ver Todas</div>
      </div>
	</div>`;
