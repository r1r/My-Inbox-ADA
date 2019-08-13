jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");
jQuery.sap.require("sap.ui.core.Fragment");
jQuery.sap.require("sap.ui.core.util.Export");
jQuery.sap.require("sap.ui.core.util.ExportTypeCSV");
jQuery.sap.require("com.ifx.approval.Z_MYIBX_ADA.util.ConfirmationDialogManager");
sap.ui.controller("com.ifx.approval.Z_MYIBX_ADA.controller.ADList", {
	oConfirmationDialogManager: com.ifx.approval.Z_MYIBX_ADA.util.ConfirmationDialogManager,
	onInit: function () {
		var ADScreen = new sap.ui.model.json.JSONModel({
			isADList: true,
			isUploadable: false
			
		});
		this.getView().setModel(ADScreen, "ADScreen"); // Json model to check whther to show on the First screen or Second 
		this.ADScreenModel = this.getView().getModel("ADScreen");

		/**
		 * get the Component data
		 **/
		var oComponentData = this.getOwnerComponent().getComponentData();
		//	debugger;
		this.oModel = oComponentData.startupParameters.oModel; // set the Model : this model will contain comments data when available
		this.bModelPresent = false;

		if (this.oModel || (oComponentData.oContainer && oComponentData.oContainer.getPropagateModel())) {
			this.bModelPresent = true;
			if (this.oModel) {
				this.getView().setModel(this.oModel, "detail1"); 
			}
		}
		this.oConfirmationDialogManager.setI18nBundle(this.getOwnerComponent().getModel("i18n").getResourceBundle());
		this.i18nBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
		if (!this.bModelPresent) { // if model is not propagated and not passed as component data, log an error in the console
			jQuery.sap.log.error("Data Model not defined for Comments");
		}
		if (this.bModelPresent) {
			debugger;
			var that = this;
			var iWorkItemIdInvoice = this.oModel.getData().InstanceID; //workitem id
			this.iWorkItemId = this.oModel.getData().InstanceID; //workitem id
			var oActionSave = {
					action: "Save",
					label: "Save"
				},
				oActionAccept = {
					type: "Accept",
					action: "Accept",
					label: "Approve"
				},
				/*added by udit*/
				oActionDownload = {
					action: "Download",
					label: "Download to Excel"
				},
				/*end*/
				oActionReject = {
					type: "Reject",
					action: "Reject",
					label: "Reject"
				};

			var fnHandleSave = function (oEvent) {
				var oDecision = {
					DecisionText: "Save",
					CommentMandatory: true
				};
				that.oConfirmationDialogManager.showDecisionDialog({
					question: that.i18nBundle.getText("XMSG_DECISION_QUESTION", oDecision.DecisionText),
					showNote: true,
					title: that.i18nBundle.getText("XTIT_SUBMIT_DECISION"),
					confirmButtonLabel: that.i18nBundle.getText("XBUT_SUBMIT"),
					noteMandatory: oDecision.CommentMandatory,
					confirmActionHandler: jQuery.proxy(function (oDecision, sNote) {
							that.sendAction(oDecision, sNote);
						},
						this, oDecision)
				});
			};
			var fnHandleAccept = function (oEvent) {
				var oDecision = {
					DecisionText: "Approve",
					CommentMandatory: false
				};
				that.oConfirmationDialogManager.showDecisionDialog({
					question: that.i18nBundle.getText("XMSG_DECISION_QUESTION", oDecision.DecisionText),
					showNote: true,
					title: that.i18nBundle.getText("XTIT_SUBMIT_DECISION"),
					confirmButtonLabel: that.i18nBundle.getText("XBUT_SUBMIT"),
					noteMandatory: oDecision.CommentMandatory,
					confirmActionHandler: jQuery.proxy(function (oDecision, sNote) {
							that.sendAction(oDecision, sNote);
						},
						this, oDecision)
				});
			};
			var fnHandleReject = function (oEvent) {
				var oDecision = {
					DecisionText: "Reject",
					CommentMandatory: true
				};
				that.oConfirmationDialogManager.showDecisionDialog({
					question: that.i18nBundle.getText("XMSG_DECISION_QUESTION", oDecision.DecisionText),
					showNote: true,
					title: that.i18nBundle.getText("XTIT_SUBMIT_DECISION"),
					confirmButtonLabel: that.i18nBundle.getText("XBUT_SUBMIT"),
					noteMandatory: oDecision.CommentMandatory,
					confirmActionHandler: jQuery.proxy(function (oDecision, sNote) {
							that.sendAction(oDecision, sNote);
						},
						this, oDecision)
				});
			};

			/*added by Udit*/
			var onDownloadExc = function (oEvent) {
				that.onDownloadExcel();

			};
			/*end*/
			// ADDED BY DEEPTI
			this.bOutbox = oComponentData.inboxHandle.inboxDetailView.oDataManager.bOutbox;
			// this will return a Boolean value with this flag the you can control the adding of the action button to the my inbox footer
			
			//add node in model
var node = this.getView().getModel("ADScreen").getData();
node.Outboxflag = this.bOutbox;
this.getView().getModel("ADScreen").updateBindings();
		 this.getView().getModel("ADScreen").refresh();
		 	//end of add node in model

			// Action buttons are added only if “this.bOutbox” is false. 
			if (!this.bOutbox) {
/*	this is for inbox*/
			
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionSave.action);
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionAccept.action);
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionReject.action);
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.addAction(oActionSave, fnHandleSave);
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.disableAction("Save");
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.addAction(oActionAccept, fnHandleAccept);
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.addAction(oActionReject, fnHandleReject);
				/*this.ADScreenModel.getData().isADList = false;*/
				//this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oGenericAttachmentComponent.uploadURL(uploadURL);
				/*added by udit*/
			}else {
				// This is for Outbox
this.getView().byId("idsimpleformdate").setVisible(false);

			}
		//for inbox as well as outbox
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionDownload.action);
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.addAction(oActionDownload, onDownloadExc);
			/*end*/

		}

		this.oDataModel = new sap.ui.model.odata.ODataModel(
			"/sap/opu/odata/sap/ZASSETDISPOSAL_SRV/", true); // Main Service
		if (iWorkItemIdInvoice) {
			var ADModel = new sap.ui.model.json.JSONModel(); 
			var AttModel = new sap.ui.model.json.JSONModel();
			this.oDataModel
				.read(
					"/ADDetialsSet?$filter=SwwWiid eq '" + iWorkItemIdInvoice + "'" + "&$expand=InvSupport", //service gives the details viewed on the page
					null,
					null,
					true,
					function (oData, oResponse) {
						if (oData.results) {
							ADModel.setData(oData.results);
							that.getView().setModel(ADModel, "AssetCollection");
							debugger;
						var getoutboxflag =	that.getView().getModel("ADScreen").getData();
						
							//to hide table colums in outbox
							if(getoutboxflag.Outboxflag) {
							
								var tablecolumns = that.getView().getModel("AssetCollection").getData();	
		 tablecolumns[0].Svaluedisplay = false;
		 tablecolumns[0].Pvaluediaplay = false;
		 that.getView().getModel("AssetCollection").updateBindings();
		 that.getView().getModel("AssetCollection").refresh();
		 
		 that.getView().byId("idsimpleformdate").setVisible(false);
		 
		 
							} 
								//end to hide table colums in outbox
								
							that.handleADTypeLevelActions();
						} else {
							// Handle no result
							that.getView().setModel(ADModel, "AssetCollection");
						}
					},

					function (oError) {
						that.showError(oError);
					});
					
			this.oDataModel
				.read(
					"/AttachmentsSet?$filter=SwwWiid eq '" + iWorkItemIdInvoice + "'",
					null,
					null,
					true,
					function (oData, oResponse) {
						if (oData.results) {
							AttModel.setData(oData.results);
							that.getView().setModel(AttModel, "AttachmentCollection");
						 var attachcount = that.getView().getModel("AttachmentCollection").oData.length;
							// // that.getView().byId("icon").setCount(attachcount);
							// 	//var node = that.getView().getModel("AttachmentCollection").oData.length;
							// 	var AttObject = that.getView().getModel("AttachmentCollection").getProperty("/0");
							// 	AttObject.attachCount = attachcount;
							//  that.AttachmentCollection.updateBindings();
							 
							 var node1 = that.getView().getModel("AttachmentCollection").getData()[0];
node1.attachCount = that.getView().getModel("AttachmentCollection").oData.length;
that.getView().getModel("AttachmentCollection").updateBindings();
		 that.getView().getModel("AttachmentCollection").refresh();
		that.getView().byId("icon").setText("Attachment"+"("+attachcount+")") ;
							 
							 
							

						} else {

						}
					},

					function (oError) {
						that.showError(oError);
					});

		} else {

			this.setTempModelData();
		}

		// ADDED BY DEEPTI 
		// Below code will help to get the flag and handle In respective inbox application.

		//getting the flag from Inbox/Outbox 
		this.bOutbox = oComponentData.inboxHandle.inboxDetailView.oDataManager.bOutbox;
		// this will return a Boolean value with this flag the you can control the adding of the action button to the my inbox footer

		// Action buttons are added only if “this.bOutbox” is false. 
		if (!this.bOutbox) {
//these buttons are visible in inbox
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionSave.action);
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionAccept.action);
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionReject.action);

			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.addAction(oActionSave, fnHandleSave);
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.disableAction("Save");
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.addAction(oActionAccept, fnHandleAccept);
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.addAction(oActionReject, fnHandleReject);
		}
		
		//attachment model
			var NewAttachmentCollection = new sap.ui.model.json.JSONModel();
			this.getView().setModel(NewAttachmentCollection, "NewAttachmentCollection");
			that.aUploadDataSet={"results":[]};
		
	
		// ENDED By DEEPTI
		
		
		if (sap.ui.Device.system.phone) {
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.removeAction(oActionDownload.action);
			
		}

	},
	/** 
	 * to navigate to detisl page of Asset details
	 * @param oEvent
	 */

	/*For Upload by Udit */
	/* uploadAttachment:function(e){
		debugger;
		var ColumnListItems=e.getSource().getParent().getParent().getParent().getItems();
		
		iItemLineIndex = e.getSource().sId;
		iItemLineIndex = iItemLineIndex.substring(iItemLineIndex.lastIndexOf("-") + 1);
		
		for(i=0;i<ColumnListItems.length;i++){
			sIDColumnListItems=ColumnListItems[i].sId;
			sIDColumnListItems=sIDColumnListItems.substring(sIDColumnListItems.lastIndexOf("-") + 1);
			
			if(iItemLineIndex==sIDColumnListItems){
				SubItemId=i;
				break;
			}
		}
		
		var oFileuploadDialog = sap.ui.getCore().byId("fileuploaderDialog");
		oFileuploadDialog.addContent(sap.ui.getCore().byId("fileUploader_AD"));
		oFileuploadDialog.open(e);
	},*/
	/*end*/

	onADDetailsPress: function (oEvent) {

		var oItem, oCtx;
		var adObjPg = this.getView().byId("adObjPg");
		oItem = oEvent.getParameter("listItem");
		oCtx = oItem.getBindingContextPath();
		adObjPg.bindElement({
			path: oCtx,
			model: "AssetCollection"
		});
		this.ADScreenModel.getData().isADList = false;
		this.ADScreenModel.updateBindings();
	},
	onAttItemPress: function (oEvent) {
		var lineitem = oEvent.getSource().getBindingContext("AttachmentCollection").getPath().split("/")[1];
		var oItem = oEvent.getSource().oBindingContexts.AttachmentCollection.oModel.oData[lineitem];
		//oEvent.getSource().oBindingContexts.AttachmentCollection.getProperty(oEvent.getSource().getBindingContextPath());
		sap.m.URLHelper.redirect(oItem.DownloadURL, true);
		//parent.window.open(oItem.DownloadURL, 'blank');
	},
	onBack: function (oEvent) {
		
	/*	for the below code we are getting error in handleADTypeLevelActions ..  Cannot read property 'getComponentData' of undefined
	var Adscreenmodeldata = this.getView().getModel("ADScreen").getData();
		if(Adscreenmodeldata.Outboxflag){
			//this is out box
			//hide form
			this.getView().byId("idsimpleformdate").setVisible(false);
		}else{
				this.ADScreenModel.getData().isADList = true;
		this.ADScreenModel.updateBindings();
		}*/
	/*	var Adscreenmodeldata = this.getView().getModel("ADScreen").getData();
		if(!Adscreenmodeldata.Outboxflag){
			/*this is inbox*/
	//commet on 3pm on 3182019		this.ADScreenModel.getData().isADList = true;
	//commet on 3pm on 3182019	this.ADScreenModel.updateBindings();
		
		
		
	//	if(!this.bOutbox){
		// 	//if it is in inbox
			
	//commented on 13082019	this.ADScreenModel.getData().isADList = true;
	//commented on 13082019	this.ADScreenModel.updateBindings();
		
	//	}
	//	else
	//	{
			
			//this is outbox
							//hide the form
							
						//commented on 18032018	this.getView().byId("idsimpleformdate").setVisible(false);
			/*this.ADScreenModel.getData().isADList = false;
				this.ADScreenModel.updateBindings();*/
				//to hide table first 2  columns 

	/*	var tablecolumns = this.getView().getModel("AssetCollection").getData();
		tablecolumns[0].Svaluedisplay = false;
		tablecolumns[0].Pvaluediaplay = false;
		this.getView().getModel("AssetCollection").updateBindings();
		this.getView().getModel("AssetCollection").refresh();*/
	//	}
	/*	if(this.bOutbox){this.ADScreenModel.getData().isADList="false"}*/
		// this.ADScreenModel.getData().isADList = true;
		// this.ADScreenModel.updateBindings();
	if(!this.bOutbox){
		// 	//if it is in inbox
	//	alert("this is inbox");	
		this.ADScreenModel.getData().isADList = true;
		this.ADScreenModel.updateBindings();
		
		}
	else
	{
	//	alert("this is outbox");
		this.ADScreenModel.getData().isADList = true;
		this.ADScreenModel.updateBindings();
		this.getView().byId("idsimpleformdate").setVisible(false);
		
	}
			
		 
	},
	fnShowReleaseLoader: function (bValue) {
		var oValue = {};
		oValue["bValue"] = bValue;
		if (this.bModelPresent) { // only if the model is set, add comment
			//	this.getOwnerComponent().getEventBus().publish("cross.fnd.fiori.inbox.dataManager", "showReleaseLoader", oValue);
			var oComments = this.getOwnerComponent().oComponentData.inboxHandle.inboxDetailView._getIconTabControl("Comments");
			this.getView().setBusy(bValue);
			this.getOwnerComponent().oComponentData.inboxHandle.inboxDetailView._setBusyIncdicatorOnDetailControls(oComments, bValue);
		}
	},
	onDownloadExcel: function (oEvent) {
		var oExport = new sap.ui.core.util.Export({

			// Type that will be used to generate the content. Own ExportType's can be created to support other formats
			exportType: new sap.ui.core.util.ExportTypeCSV({
				separatorChar: ",",
				mimeType:"text\csv"
				
			}),

			// Pass in the model created above
			models: this.getView().getModel("AssetCollection"),

			// binding information for the rows aggregation
			rows: {
				path: "/"
			},

			// column definitions with column name and binding info for the content

			columns: [
						
				{
				name: "Asset No",
				template: {
					content: "{Anln1}"
				}
			}, {
				name: "Sub No",
				template: {
					content: "{Anln2}"
				}
			}, {
				name: "Description",
				template: {
					content: "{Txt50}"
				}
			}, {
				name: "Capitalisation Date",
				template: {
					//content : "{Aktiv}"
					content: "{ path:'Aktiv', type:'sap.ui.model.type.Date', formatOptions: { pattern: 'dd/MM/yyyy'} }"
				}
			}, {
				name: "Acq Value",
				template: {
					content: "{Kansw} {Waers}"
				}
			}, {
				name: "NetBook Value",
				template: {
					//this is changed because of wrong binding 19032019
					content: "{Nbvifrs} {Waers}"
				}
			}, {
				name: "NetBook Value Local GAAP",
				template: {
					//removed the unit EUR 10052019
					content: "{Nbvlg}"
				}
			}, {
				name: "Acq Value Part Sale",
				template: {
					content: "{Aqvps}"
				}
			}, {
				name: "Sales Value",
				template: {
					content: "{Svalue}"
				}
			}, {
				name: "Asset DataSheet",
				template: {
					content: "{Ord41}"
				}
			}, {
				name: "Receiver",
				template: {
					content: "{Recvr}"
				}
			}, {
				name: "Receiver Cost Center",
				template: {
					content: "{Ccrcvr}"
				}
			}, {
				name: "Receiver Company Code",
				template: {
					content: "{Bukrsrcvr}"
				}
			}, {
				name: "Posting Date",
				template: {
					content: "{Pstdat}"
				}
			}, {
				name: "Cost Center",
				template: {
					content: "{Kostl}"
				}
			}, {
				name: "Inventory Number.",
				template: {
					content: "{Invno}"
				}
			}, {
				name: "Remarks",
				template: {
					content: "{Remarks}"
				}
			}, {
				name: "Reason for Scraping",
				template: {
					content: "{Scrap}"
				}
			}, ]
		});

		// download exported file
		oExport.saveFile().catch(function (oError) {
			sap.m.MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
		}).then(function () {
			oExport.destroy();
		});

	},

	onPdfClick: function (oEvent) {

		/*var oItem, oCtx;*/
		/* var that=this;
			var id = oEvent.mParameters.id;
			var index =  id.lastIndexOf("-");
			var lineItem = id.substring(index+1,id.length);
			var url =  that.getView().getModel("InvPoModel").oData.InvoiceLineSet.results[lineItem].InvImageUrl;
	    	
	 sap.m.URLHelper.redirect(url, true);*/
	},

	sendAction: function (oDecision, sNote) {
		var sSuccessMessage;

		var AssetObject = this.getView().getModel("AssetCollection").getProperty("/0");
		//	var AttObject = this.getView().getModel("AttachmentCollection").getProperty("/0");
		
	
		
		// Dighe 01-03-2019
		var bFlag = true;
		// end
		var that = this;
		var sSAPOrigin = this.oModel.getData().SAP__Origin;
		var sInstNo = AssetObject.SwwWiid;
		
	
	
		delete AssetObject.__metadata;
		delete AssetObject.InvSupport;

		if (AssetObject.Level == "080") {
		var	type = this.getView().getModel("AssetCollection").getData()[0].Ttype;
			var level=	this.getView().getModel("AssetCollection").getData()[0];
									if(type == "3RD" || type == "ICT"){
									//	string = approval_dashboard.utils.localization.getText("LBL_AssetNo")+";"+approval_dashboard.utils.localization.getText("LBL_SubNo")+";"+approval_dashboard.utils.localization.getText("LBL_TRADINGPARTNER_UI5")+";"+approval_dashboard.utils.localization.getText("LBL_ASSETVALUEDATE_UI5")+";"+approval_dashboard.utils.localization.getText("LBL_ASSETVALUEPOSTINGDATE_UI5")+";"+approval_dashboard.utils.localization.getText("LBL_AssetTransactionType_UI5")+";"+approval_dashboard.utils.localization.getText("LBL_SALESVALUE_UI5")+";"+approval_dashboard.utils.localization.getText("LBL_PARTIALACQVALUE_UI5")+";"+'\n';
									
									var string1 ="Asset No.;Sub No.;Trading Partner;Asset Value Date;Posting Date;Asset Transaction Type;Sale Value;Acq.Value Partial Sale";
									var string2 =level.Anln1+";"+level.Anln2+";"+level.BukrsrcvrUi5+";"+level.Bzdat+";"+level.BudatUi5+";"+level.Bwasl+";"+level.SvalueUi5+";"+level.AqvpsUi5+";";
									var string_final =string1+'\n'+string2;
									
//										Trading p=BukrsrcvrUi5
									//sales value =Svalue
									//partialacq=Aqvps
//									
									}
									else if(type == "DON" || type == "RET"){
//										b_typeFlag = true;
						
										var string1 ="Asset No.;Sub No.;Asset Value Date;Posting Date;Asset Transaction Type;Acq.Value Partial Sale";
									var string2 =level.Anln1+";"+level.Anln2+";"+level.Bzdat+";"+level.BudatUi5+";"+level.Bwasl+";"+level.AqvpsUi5+";";
									var string_final =string1+'\n'+string2;

									}
									else if(type == "CAN" || type == "THE" || type == "IDF"){
									
										var string1 ="Asset No.;Sub No.;Asset Value Date;Posting Date;Asset Transaction Type";
									var string2 =level.Anln1+";"+level.Anln2+";"+level.Bzdat+";"+level.BudatUi5+";"+level.Bwasl+";";
									var string_final =string1+'\n'+string2;
									}
									else if(type == "CTO"){
										//string = ;"+approval_dashboard.utils.localization.getText("LBL_ASSETVALUEDATE_UI5")+";"+'\n';
											var string1 ="Asset No.;Sub No.;Asset Value Date;";
									var string2 =level.Anln1+";"+level.Anln2+";"+level.Bzdat+";";
									var string_final =string1+'\n'+string2;
									}
									else{
//										same as other than qps
														//handled in Snote
														
									/*	odataEntry.C100t01 = sWorkItemId;//wId
										odataEntry.C500t01 = sApproverComments;//sComments
										odataEntry.C01t01 = sDecisionId;//decisionId
										odataEntry.C01t02 ="X";//commit symbol
										odataEntry.C20t09="X";*/
									}
//									}
					AssetObject.Remarks = sNote+'\n'+string_final; //sComments
			if (AssetObject.Zpartial == "" && AssetObject.AqvpsUi5 != "") {
				var sErrorMessage = "Partial Acq. Value/scrap indicator is not checked for Asset(s) " + AssetObject.Anln1 +
					".So Partial Retirement not possible.";
				bFlag = false;
				sap.m.MessageBox.error(sErrorMessage);
				
			}
			switch (oDecision.DecisionText) {
			case "Save":
				AssetObject.Action = "S";
				break;
			case "Approve":
				AssetObject.Action = "A";
				break;
			case "Reject":
				AssetObject.Action = "R";
				break;
			default:
			}

	}	 else {

			AssetObject.Remarks = sNote; //sComments
			switch (oDecision.DecisionText) {
			case "Save":

				AssetObject.Action = "S";
				break;
			case "Approve":

				AssetObject.Action = "A";
				break;
			case "Reject":

				AssetObject.Action = "R";
				break;
			default:
			}

		}
		if (bFlag) {
			this.fnShowReleaseLoader(true);
			/*this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.addComment(sSAPOrigin, sInstNo, sNote, jQuery.proxy(
				function (data, response) {
				that.updateAction(AssetObject,sSAPOrigin, sInstNo);
				}, this), jQuery.proxy(function (oError) {
				that.showError(oError);
			}, this));*/
			if (oDecision.CommentMandatory || sNote.length > 0) {
				this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.addComment(sSAPOrigin, sInstNo, sNote, jQuery.proxy(
					function (data, response) {
						that.updateAction(AssetObject, sSAPOrigin, sInstNo);
					}, this), jQuery.proxy(function (oError) {
					that.showError(oError);
				}, this));
			} else {
				that.updateAction(AssetObject, sSAPOrigin, sInstNo);
			}
	
		}
	},
	updateAction: function (AssetObject, sSAPOrigin, sInstNo) {

		var that = this;
		var sAction = AssetObject.Action;
		
		if(sAction=="S"){
			//if save use batch operation 
		
		var aBatchArray =[];
		var assetcollectionmodel = this.getView().getModel("AssetCollection");
		//this.getView().getModel("AssetCollection").getData()[0].SvalueUi5;
		for (var i = 0; i < assetcollectionmodel.getData().length; i++) {

if(i>0){
			delete assetcollectionmodel.oData[i].__metadata;
				delete assetcollectionmodel.oData[i].InvSupport;
	
}

				var batchUpdateOp = that.oDataModel.createBatchOperation("ADDetialsSet", "POST", assetcollectionmodel.getData()[i]);
			aBatchArray.push(batchUpdateOp);

		}
		that.oDataModel.addBatchChangeOperations(aBatchArray);
		that.oDataModel.submitBatch(function (data) {

				if (sAction != "S") {
					that.refreshTask(sSAPOrigin, sInstNo);
				}
				if (sAction == "A") {
					sap.m.MessageToast.show("Successfully Approved");
					that.refreshTask(sSAPOrigin, sInstNo);
				}
				if (sAction == "R") {
					sap.m.MessageToast.show("Successfully Rejected");
					that.refreshTask(sSAPOrigin, sInstNo);
				}
				if (sAction == "S") {
					sap.m.MessageToast.show("Successfully Saved");
					that.refreshTask(sSAPOrigin, sInstNo);
				}

			},
			function (oError) {
				//that.appView.setProperty("/busy",false);
				that.showError(oError);
			}, false);

		/*
				this.oDataModel.create(
					'/ADDetialsSet',
					AssetObject,
					null,
					function (oData,
						oResponse) {
							if(sAction!="S"){
						that.refreshTask(sSAPOrigin, sInstNo);
							}
							if(sAction=="A"){
								sap.m.MessageToast.show("Successfully Approved");
								that.refreshTask(sSAPOrigin, sInstNo);
							}
								if(sAction=="R"){
								sap.m.MessageToast.show("Successfully Rejected");
								that.refreshTask(sSAPOrigin, sInstNo);
							}
								if(sAction=="S"){
								sap.m.MessageToast.show("Successfully Saved");
								that.refreshTask(sSAPOrigin, sInstNo);
							}
							
							
					},
					function (oError) {
						that.showError(oError);
					});*/
		
			//end of batch operation
		}else{
			//if approve or reject  send only one line item
		/*		var that = this;
		var sAction=AssetObject.Action;*/
		this.oDataModel.create(
			'/ADDetialsSet',
			AssetObject,
			null,
			function (oData,
				oResponse) {
					if(sAction!="S"){
				that.refreshTask(sSAPOrigin, sInstNo);
					}
			},
			
function (oError) {
				that.showError(oError);
			});  

		}
		this.handleUploadPress();
	},
	handleADTypeLevelActions: function () {
		var AssetObject = this.getView().getModel("AssetCollection").getProperty("/0");
		// TODO: Handle Reject Button & Upload Button 
		if (sap.ui.Device.system.phone) {
			if (AssetObject.Level > 20) {
				// TODO: Handle Reject Button & Upload Button FonB
				
				// Disable Reject 
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.disableAction("Reject");
				
					// commt on 180319 to make upload diaable in outbox	
				/*	this.ADScreenModel.getData().isUploadable = true;
				this.ADScreenModel.updateBindings();*/
				
				/*-----------*/
					if(this.bOutbox){
						// disable Upload only in outbox
						// alert("outbox if level >20");
								this.ADScreenModel.getData().isUploadable = false;
				this.ADScreenModel.updateBindings();
				}else{
			
				// Enable Upload only in inbox
					// alert("inbox if level >20");
								this.ADScreenModel.getData().isUploadable = true;
				this.ADScreenModel.updateBindings();}
				
				/*------------*/
			
			} else if (AssetObject.Level <= 20) {
				// TODO: Handle Reject Button & Upload Button 
				// Enable Reject 
				// Disable Upload 
				
			}
		} else {
			if (AssetObject.Level > "030") {
				// TODO: Handle Reject Button & Upload Button 
				// Disable Reject 
				this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.disableAction("Reject");
				// Enable Upload 
					// commt on 180319 to make upload diaable in outbox	
			/*	this.ADScreenModel.getData().isUploadable = true;
				this.ADScreenModel.updateBindings();*/
				
					/*-----------*/
					if(this.bOutbox){
						// disable Upload only in outbox
						// alert("outbox if level> 030");
								this.ADScreenModel.getData().isUploadable = false;
				this.ADScreenModel.updateBindings();
				}else{
			
				// Enable Upload only in inbox
					// alert("inbox if level > 030");
								this.ADScreenModel.getData().isUploadable = true;
				this.ADScreenModel.updateBindings();}
				
				/*------------*/
				
			} else if (AssetObject.Level < "030") {
				// TODO: Handle Reject Button & Upload Button 
				// Enable Reject 
				// Disable Upload 
			} else if (AssetObject.Level == "030") {
				// TODO: Handle Reject Button & Upload Button 
				// Enable Reject 
				// Enable Upload 
				/*this.getView().setModel(ADScreen, "ADScreen");
		this.ADScreenModel = this.getView().getModel("ADScreen"); Commented by Vijay*/
		// commt on 180319 to make upload diaable in outbox	
			/*	this.ADScreenModel.getData().isUploadable = true;
				this.ADScreenModel.updateBindings();*/
				
					/*-----------*/
					if(this.bOutbox){
						// disable Upload only in outbox
						// alert("outbox if level> 030");
								this.ADScreenModel.getData().isUploadable = false;
				this.ADScreenModel.updateBindings();
				}else{
			
				// Enable Upload only in inbox
					// alert("inbox if level > 030");
								this.ADScreenModel.getData().isUploadable = true;
				this.ADScreenModel.updateBindings();}
				
				/*------------*/
				
				
			}
		}
		if (AssetObject.Svaluedisplay || AssetObject.Svaluedisplay || AssetObject.Pvaluediaplay || AssetObject.Pddisplay || AssetObject.Tpdisplay ||
			AssetObject.Ttdisplay || AssetObject.Vddisplay) {
			this.getOwnerComponent().getComponentData().startupParameters.inboxAPI.enableAction("Save");
		}
	},
	postComment: function (sSAPOrigin, sInstNo, sNote) {
		var that = this;
		this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.addComment(sSAPOrigin, sInstNo, sNote, jQuery.proxy(
			function (data, response) {

			}, this), jQuery.proxy(function (oError) {
			that.showError(oError);
		}, this));
	},
	refreshTask: function (sSAP__Origin, sInsNo) {
		this.fnShowReleaseLoader(false);
		this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.fireItemRemoved();
		this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.oModel.refresh();
		this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.processListAfterAction(sSAP__Origin, sInsNo);
		this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.triggerRefresh("SENDACTION", this.getOwnerComponent()
			.getComponentData().inboxHandle.inboxDetailView.oDataManager.ACTION_SUCCESS);
		this.getOwnerComponent().getComponentData().inboxHandle.inboxDetailView.oDataManager.fireActionPerformed();

	},
	/** 
	 * to parse the oData Error Reposnse and show as mssage.
	 * @param oError
	 */
	showError: function (oError) {

		var messages = new Array();

		if (oError.response) {
			if (oError.response.body) {
				if (jQuery.parseJSON(oError.response.body).error.innererror.errordetails) {

					for (var i = 0; i < jQuery.parseJSON(oError.response.body).error.innererror.errordetails.length; i++) {
						messages
							.push(jQuery
								.parseJSON(oError.response.body).error.innererror.errordetails[i].message);
					}
				}
				if (jQuery.parseJSON(oError.response.body).error.message) {

					messages
						.push(jQuery
							.parseJSON(oError.response.body).error.message.value);

				}
			}
		}
		var messageTxt = '';
		if (messages.length > 0) {
			for (var i = 0; i < messages.length; i++) {
				messageTxt = messages[i] + '\n' + '\n' + messageTxt;
			}
		}
		if (messages.length == 0) {

			messageTxt = oError.response.body + '\n';

		}
		sap.m.MessageBox.show(messageTxt, {
			icon: sap.m.MessageBox.Icon.ERROR,
			title: "Error"
		});
	},
	formatAssetNoAndSubNo: function (sAssetNo, sSubNo) {

		var str = '' + sSubNo;
		while (str.length < 3) {
			str = '0' + str;
		}
		str = sAssetNo + '-' + str;
		return str;

	},
	setTempModelData: function () {
		var tADModel = new sap.ui.model.json.JSONModel();
		var invSupport = {
			results: [{
				Key: 1
			}, {
				Key: 2
			}]
		};
		var AD = [{
			"Mandt": "410",
			"RequGuid": "24F473591623B86FE1000000AC1C9A57",
			"Bukrs": "3140",
			"Anln1": "10003112",
			"Anln2": "0",
			"Ttype": "RET",
			"Zpartial": "",
			"Logsys": "QP8CLNT888",
			"Site": "330",
			"Kokrs": "3140",
			"Invno": "",
			"Txt50": "Siemens OpenStage 40 (lava) IP phone",
			"Typbz": "",
			"Aktiv": "\/Date(1314230400000)\/",
			"Kostl": "CH258",
			"Prctr": "96",
			"Ord41": "",
			"Kansw": "2162.000",
			"Nbvifrs": "0.000",
			"Nbvlg": "0.000",
			"Ivslg": "0.000",
			"Invsl1": "",
			"Invetx1": "",
			"Invsl2": "",
			"Invetx2": "",
			"Aqvps": "0.000",
			"Svalue": "0.000",
			"Scrap": "ASSET OBSOLETE",
			"Recvr": "",
			"Bukrsrcvr": "",
			"Ccrcvr": "",
			"Remarks": "",
			"Pstdat": null,
			"OkStatus": "OK",
			"TimestampStart": "20170724164206",
			"TimestampEnd": "             0",
			"DateStart": "\/Date(1500854400000)\/",
			"DateEnd": null,
			"Status": "OPEN",
			"Creator": "LOPELUIS",
			"ArchiveId": "TA",
			"DocId": "25F473591623B86FE1000000AC1C9A57",
			"ArchiveIdLongt": "",
			"DocIdLongt": "",
			"ObjidDocClnt": "",
			"WfCompleted": false,
			"LongtLinked": false,
			"TmpDelStatus": "",
			"Room": "",
			"RecLoc": "",
			"Waers": "PMB",
			"BukrsrcvrUi5": "",
			"Bzdat": "",
			"Bwasl": "",
			"AqvpsUi5": "",
			"SvalueUi5": "",
			"BudatUi5": "",
			"SwwWiid": "000057899487",
			"Pvdisplay": false,
			"Tpdisplay": false,
			"Ttdisplay": false,
			"Vddisplay": false,
			"Pddisplay": false,
			"InvSupport": {
				"results": [

				]
			}
		}, {
			"Txt50": "Txt51",
			"Anln2": "Anln2",
			"InvSupport": invSupport
		}];

		tADModel.setData(AD);
		this.getView().setModel(tADModel, "AssetCollection");
	},

	// Dighe 28-02-2019
	uploadAttachment: function (oEvent) {
		debugger;
		//  // create a fragment with dialog, and pass the selected data
		if (!this.dialog) {
			// This fragment can be instantiated from a controller as follows:
			this.dialog = sap.ui.xmlfragment("com.ifx.approval.Z_MYIBX_ADA.util.upload", this);
			debugger;
		}
		debugger;
		// return this.dialog;
		this.currentSelectedItem = this.getView().getModel("AssetCollection").getProperty(oEvent.getSource().getParent().getBindingContextPath());

		/*var oFileUploader = sap.ui.getCore().byId("fileUploader");

		var sUrl = "/sap/opu/odata/sap/ZASSETDISPOSAL1_SRV/AttachmentsSet(SwwWiid='" + this.iWorkItemId + "',Bukrs='" + currtentSelectItem.Bukrs +
			"',Anln1='" + currtentSelectItem.Anln1 + "',Anln2='" + currtentSelectItem.Anln2 + "',Req_Guid='" + currtentSelectItem.RequGuid +
			"')/Attachments_Att_DetailsNav";
		oFileUploader.setUploadUrl(sUrl);*/
		var oView = this.getView();
		oView.addDependent(this.dialog);
		this.dialog.open();

		//this.getAttachments();  
		// var oView = this.getView();

		// create dialog lazily
		// if (!this.byId("helloDialog")) {
		// 	// load asynchronous XML fragment
		// 	sap.ui.core.Fragment.load({
		// 		id: oView.getId(),
		// 		// name: "demo.test.util.upload"
		// 		name:com.ifx.approval.Z_MYIBX_ADA.util.upload
		// 	}).then(function (oDialog) {
		// 		// connect dialog to the root view of this component (models, lifecycle)
		// 		oView.addDependent(oDialog);
		// 		oDialog.open();
		// 	});
		// } else {
		// // this.oDialog.close();
		// }

	},
	closeDialog: function (oEvent) {

		oEvent.getSource().getParent().close();
	},
	handleUploadComplete: function (oEvent) {
		debugger;
		oEvent.getSource().getParent().close();
		var sResponse = oEvent.getParameter("status");
		if (sResponse == 201) {
			var sMsg = "";

			sMsg = "Upload Success";
			// MessageToast.show("Attachment Uploaded");

		} else {
			sMsg = "Upload Error";
		}

		sap.m.MessageToast.show(sMsg);
		this.getAttachments();

	},
	getAttachments: function () {
		var that = this;
		var AttModel = new sap.ui.model.json.JSONModel();
		this.oDataModel
			.read(
				"/AttachmentsSet?$filter=SwwWiid eq '" + this.iWorkItemId + "'",
				null,
				null,
				true,
				function (oData, oResponse) {
					if (oData.results) {
						AttModel.setData(oData.results);
						that.getView().setModel(AttModel, "AttachmentCollection");
					

					} else {

					}
				},

				function (oError) {
					that.showError(oError);
				});

	},
	onfileupload:function(){
		
		var that = this;
		var oFileUploader = sap.ui.getCore().byId("fileUploader");
		oFileUploader.destroyHeaderParameters();
			var attachdetail =that.currentSelectedItem;
		
		this.aUploadDataSet.results.push({
					   	
						FileName: oFileUploader.FUEl.files[0].name,
					
						SwwWiid: attachdetail.SwwWiid,
					   "Delete":"sap-icon://decline",
					   "Assetno":attachdetail.Anln1,
					   "subno":attachdetail.Anln2
//					   "AttachIcon":""
				   });
		/*	var oAttachmentModel =	   this.getView().getModel("NewAttachmentCollection").getData().results;
			if(oAttachmentModel.length==0){
				this.getView().getModel("NewAttachmentCollection").setData(aUploadDataSet);
			}else{
				var obj = aUploadDataSet.results;
					   var oModel = this.getView().getModel("NewAttachmentCollection").getData().results;
					   var dataLength  = oModel.length;
					   
					   for(var i=0;i<obj.length;i++){
						   
						   oModel[dataLength] = obj[i];
						   dataLength++;
						   
					   }
				
			}*/
			this.getView().getModel("NewAttachmentCollection").setData(this.aUploadDataSet);
			this.getView().getModel("NewAttachmentCollection").updateBindings(true);
											this.getView().getModel("NewAttachmentCollection").refresh(true);
			var oAttachmentsLst = this.getView().byId("tempattachmentlist");
								var oItemlistTempAttachment = new sap.m.ObjectListItem({
									type: "Active",
									title: "{NewAttachmentCollection>FileName}  ", //title
								attributes: [new sap.m.ObjectAttribute({text: "{NewAttachmentCollection>Assetno} {NewAttachmentCollection>subno}"})]  
								
								});
								oAttachmentsLst.bindAggregation("items", "NewAttachmentCollection>/results", oItemlistTempAttachment);
								
								this.dialog.close();
							//	this.dialog.destroy();
							//	this.dialog.destroyContent();
			
	},
	onDeleteAttachmentPress: function(oEvent){
		debugger;
		var oModelAttach = this.getView().getModel("NewAttachmentCollection");
		var copyoModelAttach = oModelAttach.getData().results;
			var item = oEvent.getParameters().listItem.sId.substr("-1");
			copyoModelAttach.splice(item, 1);
			oModelAttach.updateBindings(true);
			oModelAttach.refresh(true);
		
		
	},
	handleUploadPress: function (oEvent) {
	
		var that = this;

		var oDataAttachmentModel = new sap.ui.model.odata.ODataModel(
			"/sap/opu/odata/sap/ZASSETDISPOSAL_SRV", true);
		oDataAttachmentModel.mCustomHeaders = {
			"x-csrf-token": "Fetch"
		};
		
		
		
		oDataAttachmentModel.getMetadata();
		
		
		
			oDataAttachmentModel.refreshSecurityToken(function() {
  
     //oDataAttachmentModel.oHeaders(['x-csrf-token']); 
}, function() {
  
}, false);

		var sToken = oDataAttachmentModel.getSecurityToken();
		var oFileUploader = sap.ui.getCore().byId("fileUploader");
		if(oFileUploader!=undefined){
		oFileUploader.destroyHeaderParameters();
		var attachdetail = that.currentSelectedItem;
	var attachmentlength =	this.getView().getModel("NewAttachmentCollection").getData().results
	//	attachdetail.Anln1,attachdetail.Anln2,attachdetail.SwwWiid,attachdetail.Bukrs,attachdetail.RequGuid
	
	//	Anln1, Anln2,SwwWiid, Bukrs, Req_Guid,FileNameoFileUploader.FUEl.files[0].name
	if(attachmentlength.length>0){
		/*if(attachmentlength.length==1){
			attachmentlength.length = 1;
		}else{
			attachmentlength.length = attachmentlength.length-1;
		}*/
	
	
		oDataAttachmentModel
			.read(
				"/AttachmentsSet",
				null,
				null,
				true,
				function (oData, oResponse) {
					if(attachmentlength.length==1){
					var headerParameters1 = new sap.ui.unified.FileUploaderParameter({
						name: "slug",
						value: attachdetail.Anln1+","+attachdetail.Anln2+","+attachdetail.SwwWiid+","+attachdetail.Bukrs+","+attachdetail.RequGuid+","+attachmentlength[0].FileName
					});
					var headerParameters2 = new sap.ui.unified.FileUploaderParameter({
						name: "x-csrf-token",
						value: sToken//oResponse.headers["x-csrf-token"]
					});
					}else{
							for(var i=0;i<attachmentlength.length-1;i++){
						
						var headerParameters1 = new sap.ui.unified.FileUploaderParameter({
						name: "slug",
						value: attachdetail.Anln1+","+attachdetail.Anln2+","+attachdetail.SwwWiid+","+attachdetail.Bukrs+","+attachdetail.RequGuid+","+attachmentlength[i].FileName
					});
					var headerParameters2 = new sap.ui.unified.FileUploaderParameter({
						name: "x-csrf-token",
						value: sToken//oResponse.headers["x-csrf-token"]
					});
							}//end of for	
					}

					oFileUploader.addHeaderParameter(headerParameters1);
					oFileUploader.addHeaderParameter(headerParameters2);
					oFileUploader.upload();
				},

				function (oError) {
					sap.m.MessageToast
						.show("Error while loading token ");
				});
	
	
	}//end of if
		// 	var oFileUploader =oEvent.getSource().getParent().getContent()[0];
		// oFileUploader.setUploadUrl("/sap/opu/odata/sap/ZASSETDISPOSAL1_SRV/AttachmentsSet(SwwWiid='000057847692',Bukrs='3140',Anln1='10001826',Anln2='0',Req_Guid='64F73E5AC0F82C4EE1000000AC1C9A57')/Attachments_Att_DetailsNav");
		// 			oFileUploader.upload();
		}//end of if o == undefined
	},
	// hideforminoutbox:function(){
	// 	debugger;
	// 	alert("infunction");
	// }

	//End Dighe 06-03-2019

});