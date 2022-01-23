const programs = [
	["BruteSSH.exe", 0],
	["FTPCrack.exe", 100],
	["relaySMTP.exe", 200],
	["HTTPWorm.exe", 450],
	["SQLInject.exe", 700],
	["DeepscanV1.exe", 5],
	["DeepscanV2.exe", 300],
	["ServerProfiler.exe", 5],
	["AutoLink.exe", 0]
]

/** @param {import(".").NS } ns */
export async function main(ns) {
	// Disable the log
	ns.disableLog("ALL");

	ns.tail(); // Open a window to view the status of the script
	let timeout = 250; // In ms - too low of a time will result in a lockout/hang

	var longTimeout = 300000;
	var fallbackCounter = 0;

	while (true) {
		await ns.sleep(timeout); // Wait it out first
		if (ns.isBusy()) continue;
		let choices = programs.filter((program) => {
			return !ns.ls("home", ".exe").includes(program[0]) && ns.getHackingLevel() > program[1];
		});
		if (choices.length == 0) {
			if (ns.getHackingLevel() < 750) {
				if (fallbackCounter > 9) {
					ns.print(`Insufficient hacking level, try leveling hacking skill`);
				} else {
					let timeoutMin = longTimeout / 60000;
					ns.print(`Insufficient hacking level to create all programs, waiting additional ${timeoutMin} mins`);
					var longTimeout = longTimeout * 2;
					var fallbackCounter = fallbackCounter + 1;
					await ns.sleep(longTimeout);
				}
			} else {
				ns.print(`No new programs are available to create`);
				exit();
			}
		} else {
			ns.print(`Trying to create program: ${choices[0]}`);
			var fallbackCounter = 0;
			ns.createProgram((choices[0])[0]);
		}
	}
}
