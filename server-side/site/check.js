const npmCheck = require('npm-check');

function print_package_info(packages) {
	for (index in packages) {
		package = packages[index]
		message = package.moduleName+ " " + package.installed + ": "
		if (package.unused == true) {
			message+="Unused!"
		} else if (package.bump != null ){
			message+=package.bump+" update available to "+package.latest
		} else {
			message+="No updates"
		}
		console.log(message)
	}
		
}

options = {}

npmCheck(options)
  .then(currentState => print_package_info(currentState.get('packages')));
