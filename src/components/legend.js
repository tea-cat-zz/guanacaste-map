export default symbolTypes =>
  `<div>
	    <h4>Puestos Estaciónes y Tourismos</h4>
			<div id="legend-items">
          ${symbolTypes
            .map(
              symbolType => `<div class="legend-item active" id="${
                symbolType.name
              }" onClick="handleFilter('${symbolType.name}', '${symbolType.type || 'symbol'}')">
                  <span>${symbolType.label}</span>
                </div>`
            )
            .join('')}
          <div onClick="noFilter()">Toggle Off Filters</div>
			</div>
	</div>`;
