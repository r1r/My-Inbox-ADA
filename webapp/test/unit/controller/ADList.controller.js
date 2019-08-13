/*global QUnit*/

sap.ui.define([
	"com/ifx/approval/Z_MYIBX_ADA/controller/ADList.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ADList Controller");

	QUnit.test("I should test the ADList controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});