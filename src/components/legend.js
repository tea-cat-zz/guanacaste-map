export default symbolTypes =>
  `<div>
	    <h4>Puestos Estaciónes y Tourismos</h4>
			<div id="legend-items">
          ${symbolTypes.map(
            symbolType => `
                   <div onClick="handleFilter('${symbolType.name}')">
                      <span class="marker ${symbolType.label}-marker">${symbolType.icon}</span>
                      <span>${symbolType.label}</span>
                    </div>
                    `
          )}
          <div onClick="noFilter()">Toggle Off Filters</div>
			</div>
	</div>`;

// const div = document.createElement('div');
// const span = document.createElement('span');
// const labelSpan = document.createElement('span');
// span.className = `marker ${symbolType.name}-marker`;
// labelSpan.innerHTML = symbolType.label || 'No label specified';
// div.appendChild(span);
// div.appendChild(labelSpan);
// document.getElementById('legend-items').appendChild(div);
