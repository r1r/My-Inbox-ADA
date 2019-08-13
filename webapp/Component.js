sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/ifx/approval/Z_MYIBX_ADA/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.ifx.approval.Z_MYIBX_ADA.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
		//	this.setModel(models.createDeviceModel(), "device");
		},
		createContent :function(){
			var oViewData = {component: this};
                    this.view = sap.ui.view({
                     type : sap.ui.core.mvc.ViewType.XML,
                     viewName : "com.ifx.approval.Z_MYIBX_ADA.view.ADList",
                     viewData : oViewData
                    });
                    return this.view;

		}
	});
});