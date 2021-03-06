/**
 * 
 */

$('#search-runs').form({
	fields: {
		// playbook : 'empty',
		from     : 'empty',
		to       : 'empty',
		status   : 'empty',
	}
}).api({
	contentType: 'application/json',
	action: 'runs/search',
	method:'POST',
	serializeForm: true,
	beforeSend: function(settings) {
		settings.data = get_sw2_query('runs', settings.data)
		return settings;
	},
	onSuccess: function(response) {
//		console.log(response)
		search_runs(response.results)
	},
	onFailure: sw2_on_failure,
	onError: sw2_on_error,	
});

const $runs_table = $('#runs-tables tbody')
const search_runs = runs => {
//	console.log(runs)
	$runs_table.empty()
	for (let run of runs) {
		const begin = new Date(run['begin']*1000).toLocaleString()
		const playbook = run['description']['playbook']
		const playbook_link = `<a href="/show?path=${playbook}">${playbook.split('/').pop()}</a>`
		const status = run['status']
		const rc = run['return_code']
		let status_label = '<i class="blue notched circle loading icon">'
		if (status == 'finished') {
			if (rc == 0) {
				status_label = '<i class="green check icon">'
			} else {
				status_label = '<i class="red close icon">'
			}
		}
		const runid = run['runid']
		const run_link = `<a href="/show?path=${runs_dir}/${runid}/run.status">${runid}</a>`
		const line = `
			<tr>
				<td>${begin}</td>
				<td>${playbook_link}</td>
				<td>${status_label}</td>
				<td>${run_link}</td>
			</tr>`;
		$runs_table.append(line);
	}
}

const today    = new Date();
const from     = new Date(today.getFullYear(), today.getMonth(), today.getDate() - search_default['from']);
const to       = new Date(today.getFullYear(), today.getMonth(), today.getDate() + search_default['to']);
const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

//console.log(today, from, to, tomorrow)

$('#rangestart').calendar({
	type: 'date',
	endCalendar: $('#rangeend'),
	today: true,
	maxDate: tomorrow,
	onChange: function(value) {
		console.log('start', value)
	},
}).calendar('set date', from, true, false);

$('#rangeend').calendar({
	type: 'date',
	startCalendar: $('#rangestart'),
	today: true,
	maxDate: tomorrow,
	onChange: function(value) {
		console.log('end', value)
	},
}).calendar('set date', to, true, false);

console.log('OK - runs.js');