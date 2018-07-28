export default allLayers =>
  `<div class="legend-wrapper">
    <h4 class="overlay-box toggle-button" onClick="tcat.toggleLegend()">
        Puestos Estaciónes y Tourismos
        <span id="legend-toggle-icon"></span>
    </h4>
    <div class="flex-child legend-inner">
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
        <div onClick="tcat.noFilter()">Ver Todo</div>
      </div>
	</div>
</div>`;
