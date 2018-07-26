export default symbolTypes =>
  `<div>
	    <h4>Puestos Estaciónes y Tourismos</h4>
			<div id="legend-items">
          ${symbolTypes.map(
            symbolType => `
                   <div onClick="handleFilter('${symbolType.name}')">
                      <span class="marker ${symbolType.label}-marker"><svg>${
              symbolType.icon
            }</svg></span>
                      <span>${symbolType.label}</span>
                    </div>
                    `
          )}
          <div onClick="noFilter()">Toggle Off Filters</div>
			</div>
	</div>`;
