/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/ifx/approval/Z_MYIBX_ADA/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});