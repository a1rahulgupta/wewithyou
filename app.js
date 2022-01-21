import React from "react";
import { Link, hashHistory } from "react-router";
import Autosuggest from "react-autosuggest";
import AllocationActions from "../src/actions/AllocationActions";
import AllocationActionsLite from "../src/actions/AllocationActionsLite";
import AllocationStore from "../src/stores/AllocationStore";
import { Alert, Modal } from "react-bootstrap";
import Dropzone from "react-dropzone";
const Compress = require("compress.js");
import helperFunc from "../src/utils/helperFunc";
import CustomAlert from "./CustomAlert.jsx";
import paths from "../src/utils/paths";

// var DatePicker = require("react-bootstrap-date-picker");
import DatePicker from "react-16-bootstrap-date-picker";

var $ = window.$;
const timeoutType = 500;
var timer;

class EcsMandate extends React.Component {
	constructor() {
		super();
		this.state = {
			formData: {
				//ECS MANDATE VARIALBLES
				holderName: "",
				confHolderName: "",
				accNo: "",
				confAccNo: "",
				accountType: "",
				modeOpr: "",
				bankcity: "",
				bankName: "",
				bankBranch: "",
				micr: "",
				bankAdd: "",
				bankIfsc: "",
				startDate: "",
				invoiceEmail: "",
				DebitFrequency: "30",
				debitDates: "",
				nach_image_preview: "",
				outletCheck: 0,
				nach_image_show: 0,
				bank_code: 0,
				//SI MANDATE VARIALBLES
				cardHolderName: "",
				confCardHolderName: "",
				cardNumber: "",
				confCardNumber: "",
				cardType: "",
				cardBankName: "",
				expMonth: "",
				expYear: "",
				siStartDate: "",
				siEndDate: "",
				siDebFrequency: "30",
				siDebitDate: "",
				is_si: 0,
				//common
				compName: "",
				version: "",
				transaction_id: "",
				minEcsAmt: "",
				ecsAmount: 0,
				ecsMaxAmount: 0,
				ecsMaxAmount_conf: 0,
				lt_emi: -1,
				ecsWithoutTax: 0,
				mobile_number: "",
				email_id: "",
				skip_val: 0,
				enach: 0,
				consumerid: "",
				dob: "",
				pay_pc: 0,
				ecs_image_preview: "",
				ecs_image_show: 0,
				cheque_image_show: 0,
				cheque_image_preview: "",
				user_pay_mode: "",
				// mp_portal: -1, e_mandate_data: '',
			},
			//COMMON VARIABLES
			popUp: 0,
			alertPop:0,
			popupOpen:0,
			hide: 0,
			validateACNO: 1,
			saveTab: "",
			e_mandate_data: { mp_portal: -1 },
			errorCd: 0,
			errMsg: "",
			currentTab: "ecsmandate",
			tempStart: "", // Used for Datepicker value
			suggestions: [],
			autoLoader: 0,
			disableBankName: true,
			disableBankBranch: true,
			actionType: "", // API Action type used for Bank City,Name and Branch etc ..
			isNACH: "",
			showModal: 0,
			modalMsg: "",
			modalTitle: "",
			tabType: 0,
			isWarning: 0,
			warning_type: "danger",
			warning_action: "",
			alert_msg: "",
			filePath: [],

			// SI
			expMonthArr: { "1": "Jan", "2": "Feb", "3": "Mar", "4": "Apr", "5": "May", "6": "Jun", "7": "Jul", "8": "Aug", "9": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" },
			expYearArr: [],
			//debitDateArr:["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","13th","14th","15th","16th","17th","18th","19th","20th","21st","22nd","23rd","24th","25th","26th","27th","28th"],
			debitDateArr: { "5": "5th", "6": "6th", "7": "7th", "8": "8th", "9": "9th", "10": "10th", "15": "15th" },

			errorArrCd: 0,
			errMsgArr: [],
			empData: { jwt_ucode: EMPCODE },
			focusAccordion: 0,
			companyName: "",
			version: "",
			tempSiStart: "",
			showLoader: 1,
			setLoader: 0,
			showOverlay: 1,
			jdUserFlg: 0,
			netbankfact_modal: false,
			netbankfactConfirm_modal: false,
			innerDiv: true,
			mobileNum: "",
			associated_tme_code: "",
			associated_tme_name: "",
			emailId: "",
			invoice_name: "",
			paymentUrl: "",
			transId: "",
			oneRupeeFlag: 0,
			payType: "",
			eNachDigital: 1,
			handleEnach: -1,
			mandateDataExist: 0,
			successFlag: 0,
			hideShowEnach: 0,
			chequeInstrAdded: 0,
			chequeInstrAccNo: "",
			chequeInstrAccType: "",
			chequeInstrMicr: "",
			serverTime: new Date(),
			tempMinStart: "",
			tempMaxStart: "",
			enachEligible: 0,
			jdPayObj: {},
			cardValidated: 0,
			creditCardNumber: "",
			allowSkipMandate: 1, //make allowSkipMandate = 0 allow skip mandate
			allowDateEdit: 0,
			maxServerDate: "",
			iciciMandate: 0,
			currentSection: localStorage.getItem("physicalMandate") == "true" ? "bankDetails" : "accountAndEmiDetails",
			invalidMICR: false,
			invalidBankDetails: false,
			hideDOBOnVerifyAPI: false,
			invalidIfsc: false,
			ecs_image_remove: 0,
			nach_image_remove: 0,
			mandate_nach_preview: "",
			mandate_ecs_preview: "",
			cheque_image_remove: "",
			mandate_cheque_preview: "",
			mandate: localStorage.getItem("physicalMandate"),
			mobileData: ["7208676738", "7838396686", "8286741260", "9990253792", "9594869541", "9167234410", "9953943838", "8328190454"],
			consumer_code: "",
		};
		this.formUpdater = this.formUpdater.bind(this);
		this.digitalMandateUpdater = this.digitalMandateUpdater.bind(this);
		this.getBankDetails = this.getBankDetails.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleDateStart = this.handleDateStart.bind(this);
		this.handleSIDate = this.handleSIDate.bind(this);
		this.setNetBankingData = this.setNetBankingData.bind(this);
		this.handleDobChange = this.handleDobChange.bind(this);
		this.resetImage = this.resetImage.bind(this);

		/* Auto Suggest Functions*/
		this.onAutoChange = this.onAutoChange.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.checkAutoVal = this.checkAutoVal.bind(this);
		this.validateBankDetails = this.validateBankDetails.bind(this);
		this.closeCurrentAlert =  this.closeCurrentAlert.bind(this);

		/*Validator Array - Order is important which specifies the order validation*/
		this.ValidationArr = [
			"acctHolderName",
			"acctNumber",
			"accountType",
			"modeOpr",
			"bankcity",
			"bankName",
			"bankAdd",
			"bankBranch",
			"bankIfsc",
			"micr",
			"startDate",
			"DebitFrequency",
			"debitDates",
			"invoiceEmail",
			"ecsAmount",
			"ecsMaxAmount",
			"nachImage",
			"Success",
		];

		this.DebitDates = ""; // UI Component for <option> under ECS Details
		this.ecsDebitFreq = {
			wk: {
				name: "Weekly",
				days: "7",
				validdays: {
					"0": { value: "1", text: "Mondays" },
					"1": { value: "2", text: "Tuesdays" },
					"2": { value: "3", text: "Wednesdays" },
					"3": { value: "4", text: "Thursdays" },
					"4": { value: "5", text: "Fridays" },
				},
			},
			fn: {
				name: "Fortnightly",
				days: "15",
				validdays: {
					"0": { value: "1", text: "1st & 15th" },
					"1": { value: "2", text: "2nd & 16th" },
					"2": { value: "3", text: "3rd & 17th" },
					"3": { value: "4", text: "4th & 18th" },
					"4": { value: "5", text: "5th & 19th" },
					"5": { value: "6", text: "6th & 20th" },
					"6": { value: "7", text: "7th & 21st" },
					"7": { value: "8", text: "8th & 22nd" },
					"8": { value: "9", text: "9th & 23rd" },
					"9": { value: "10", text: "10th & 24th" },
					"10": { value: "11", text: "11th & 25th" },
					"11": { value: "12", text: "12th & 26th" },
					"12": { value: "13", text: "13th & 27th" },
					"13": { value: "14", text: "14th & 28th" },
				},
			},
			mn: {
				name: "Monthly",
				days: "30",
				validdays: {
					"0": { value: "1", text: "1st" },
					"1": { value: "2", text: "2nd" },
					"2": { value: "3", text: "3rd" },
					"3": { value: "4", text: "4th" },
					"4": { value: "5", text: "5th" },
					"5": { value: "6", text: "6th" },
					"6": { value: "7", text: "7th" },
					"7": { value: "8", text: "8th" },
					"8": { value: "9", text: "9th" },
					"9": { value: "10", text: "10th" },
					"10": { value: "11", text: "11th" },
					"11": { value: "12", text: "12th" },
					"12": { value: "13", text: "13th" },
					"13": { value: "14", text: "14th" },
					"14": { value: "15", text: "15th" },
					"15": { value: "16", text: "16th" },
					"16": { value: "17", text: "17th" },
					"17": { value: "18", text: "18th" },
					"18": { value: "19", text: "19th" },
					"19": { value: "20", text: "20th" },
					"20": { value: "21", text: "21st" },
					"21": { value: "22", text: "22nd" },
					"22": { value: "23", text: "23rd" },
					"23": { value: "24", text: "24th" },
					"24": { value: "25", text: "25th" },
					"25": { value: "26", text: "26th" },
					"26": { value: "27", text: "27th" },
					"27": { value: "28", text: "28th" },
				},
			},
		};
	} // constructor ends

	closeWarning(type) {
		this.setState({ alert_msg: "", isWarning: 0, warning_action: "", warning_type: "danger" });
		if (type == "redirect") {
			hashHistory.push("/payment-success/2/" + this.props.params.parentid);
		} else if (type == "proceed") {
			// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
			hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
		}
	}

	closeCurrentAlert(){
this.setState({alertPop : 0 , popupOpen : 0})
	}

	createDebitDates(frequency) {
		this.DebitDates = "";
		if (frequency == "mn") {
			this.DebitDates = Object.keys(this.state.debitDateArr).map((key) => {
				return (
					<option key={key + "dd"} value={key}>
						{this.state.debitDateArr[key]}
					</option>
				);
			});
		}
	}
	//fetchBankInfo
	componentWillMount() {
		var empcodeSpl = EMPCODE.split("-");
		if (empcodeSpl[0] == "jduser") {
			this.setState({ jdUserFlg: 1 });
		}
		let d = new Date(),
			month = "" + (d.getMonth() + 1),
			day = "" + d.getDate(),
			year = d.getFullYear();
		if (month.length < 2) month = "0" + month;
		if (day.length < 2) day = "0" + day;
		let currentDate = year + "-" + month + "-" + day;
		let newVals = {};
		newVals = helperFunc.assign(this.state.formData);
		newVals["startDate"] = currentDate;
		this.setState({ formData: newVals, tempStart: currentDate });
		AllocationStore.addChangeListener(this.onChange);
	}
	componentWillUnmount() {
		AllocationStore.removeChangeListener(this.onChange);
	}
	componentDidMount() {
		localStorage.setItem("moneyPaymentMode", "ENACH");
		var empDataArr = {};
		empDataArr = helperFunc.assign(this.state.empData);
		if (this.state.jdUserFlg == 1) {
			empDataArr["empcode"] = EMPCODE.split("-")[1];
			empDataArr["empname"] = EMPCODE;
			empDataArr["jwt_ucode"] = EMPCODE;
			empDataArr["origin_city"] = "";

			empDataArr["manage_campaign"] = 1;
			empDataArr["me_employee_type"] = "MAN_CAMP_JDUSER";
			empDataArr["me_manager_name"] = "MAN_CAMP_JDUSER_HEAD_" + EMPCODE;
			empDataArr["me_manager_code"] = "MAN_CAMP_JDUSER_HEAD_CODE_" + EMPCODE;
			empDataArr["me_reporting_head_name_2"] = "MAN_CAMP_JDUSER_HEAD_2_" + EMPCODE;
			empDataArr["me_reporting_head_code_2"] = "MAN_CAMP_JDUSER_HEAD_2_CODE_" + EMPCODE;
		} else {
			empDataArr["empcode"] = this.props["empdata"]["empcode"];
			empDataArr["empname"] = this.props["empdata"]["empname"];
			empDataArr["jwt_ucode"] = this.props["empdata"]["empcode"];
			empDataArr["origin_city"] = this.props["empdata"]["city"];

			empDataArr["manage_campaign"] = 0;
			empDataArr["me_employee_type"] = this.props["empdata"]["type_of_employee"];
			empDataArr["me_manager_name"] = this.props["empdata"]["reporting_head"];
			empDataArr["me_manager_code"] = this.props["empdata"]["reporting_head_code"];
			empDataArr["me_reporting_head_name_2"] = this.props["empdata"]["reporting_head_name_2"];
			empDataArr["me_reporting_head_code_2"] = this.props["empdata"]["reporting_head_code_2"];
			empDataArr["tme_employee_type"] = this.props["empdata"]["type_of_employee"];

			if(this.props.empdata.department && this.props.empdata.department.toLowerCase() == 'sales - jd mart') {
				empDataArr["tme_employee_type"] = 'tme';
			}
		}

		let enachEligible = 0;
		if (localStorage.getItem("enachEligible") == 1) {
			enachEligible = 1;
		}

		this.setState({ empData: empDataArr, enachEligible: enachEligible }, () => {
			AllocationActions.recieveContractInfoTable(this.props.params.parentid);
			AllocationActions.getEcsMinAmt(this.props.params.parentid, this.props.params.master_transaction_id, this.props.params.pg_trans_id);
			// // action call
			AllocationActionsLite.getConsumerCode(this.props.params.parentid);
			this.setCreditCardYear();
			helperFunc.handleInputBlurLoad();
			this.createDebitDates("mn");
		});
	}
	componentWillReceiveProps(nextProps) {
		localStorage.setItem("moneyPaymentMode", "ENACH");
		var empDataArr = {};
		empDataArr = helperFunc.assign(this.state.empData);
		if (this.state.jdUserFlg == 1) {
			empDataArr["empcode"] = EMPCODE.split("-")[1];
			empDataArr["empname"] = EMPCODE;
			empDataArr["jwt_ucode"] = EMPCODE;
			empDataArr["origin_city"] = "";

			empDataArr["manage_campaign"] = 1;
			empDataArr["me_employee_type"] = "MAN_CAMP_JDUSER";
			empDataArr["me_manager_name"] = "MAN_CAMP_JDUSER_HEAD_" + EMPCODE;
			empDataArr["me_manager_code"] = "MAN_CAMP_JDUSER_HEAD_CODE_" + EMPCODE;
			empDataArr["me_reporting_head_name_2"] = "MAN_CAMP_JDUSER_HEAD_2_" + EMPCODE;
			empDataArr["me_reporting_head_code_2"] = "MAN_CAMP_JDUSER_HEAD_2_CODE_" + EMPCODE;
			this.setState({ empData: empDataArr });
		} else {
			empDataArr["empcode"] = nextProps["empdata"]["empcode"];
			empDataArr["empname"] = nextProps["empdata"]["empname"];
			empDataArr["jwt_ucode"] = this.props["empdata"]["empcode"];
			empDataArr["origin_city"] = nextProps["empdata"]["city"];

			empDataArr["manage_campaign"] = 0;
			empDataArr["me_employee_type"] = nextProps["empdata"]["type_of_employee"];
			empDataArr["tme_employee_type"] = nextProps["empdata"]["type_of_employee"];
			empDataArr["me_manager_name"] = nextProps["empdata"]["reporting_head"];
			empDataArr["me_manager_code"] = nextProps["empdata"]["reporting_head_code"];
			empDataArr["me_reporting_head_name_2"] = nextProps["empdata"]["reporting_head_name_2"];
			empDataArr["me_reporting_head_code_2"] = nextProps["empdata"]["reporting_head_code_2"];
			if(nextProps.empdata.department && nextProps.empdata.department.toLowerCase() == 'sales - jd mart') {
				empDataArr["tme_employee_type"] = 'tme';
			}
			this.setState({ empData: empDataArr });
		}
	}

	componentDidUpdate(prevState) {
		if (this.state.currentSection != prevState.currentSection) {
			this.updateHeaderTitle();
		}
	}

	updateHeaderTitle() {
		switch (this.state.currentSection) {
			case "bankDetails":
				$("#headerName").text("Fill Bank Details");
				break;
			case "accountAndEmiDetails":
				if (this.state.mandate === "true") {
					$("#headerName").text("Fill Account & EMI Details");
				} else {
					$("#headerName").text("Account Details");
				}
				break;
			case "tokenTransactionLinkDetails":
				$("#headerName").text("Token Transaction Link");
				break;
			case "physicalMandate":
				$("#headerName").text("Upload Physical Mandate Photo");
				break;
			default:
				$("#headerName").text("Mandate");
				break;
		}
	}

	IsJsonString(str) {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	}
	onChange() {
		let data = AllocationStore.getAllocData();
		switch (data.changeFlag) {
			case "handleback":
				// if (this.state.handleEnach == 1) {
				// 	this.setState({ handleEnach: 0});
				// 	setTimeout(() => {
				// 		helperFunc.handleInputBlurLoad();
				// 		helperFunc.handleInputBlurLoadPOE();
				// 	}, 300);
				// 	return false;
				// }else{
				// 	// window.history.back();
				// 	hashHistory.push('billing-details/' + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
				// }
				if (this.state.currentSection === "accountAndEmiDetails" && this.state.mandate === "true") {
					this.setState({ handleEnach: 0, currentSection: "bankDetails" });
					setTimeout(() => {
						helperFunc.handleInputBlurLoad();
						helperFunc.handleInputBlurLoadPOE();
					}, 300);
					return false;
				} else if (this.state.currentSection === "physicalMandate" || this.state.currentSection === "tokenTransactionLinkDetails") {
					this.setState({ handleEnach: 0, currentSection: "accountAndEmiDetails" });
					setTimeout(() => {
						helperFunc.handleInputBlurLoad();
						helperFunc.handleInputBlurLoadPOE();
					}, 300);
					return false;
				} else {
					hashHistory.push("billing-details/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
					// hashHistory.push('/order-summary/' + this.props.params.parentid);
				}
				break;
			case "digital_mandate_link":
				this.setState({ showLoader: 0 });

				if (data["data"]["errorCode"] == 0) {
					// if(this.state.mandateDataExist == 1){
					// 	hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
					// 	return false
					// }else{
					this.setState({ showLoader: 1, successFlag: 1, successMsg: data["data"]["errorMsg"] });
					var objData = {};
					objData = helperFunc.assign(this.state.formData);
					objData["skip_val"] = 1;
					objData["nach_image_show"] = 2;
					objData["enach"] = 1;
					objData["consumerid"] = data.data.mandate_response["CONSUMERID"];
					objData["nach_image_preview"] = "";
					objData["ecs_image_preview"] = "";
					objData["cheque_image_preview"] = "";
					objData["is_physical_mandate"] = localStorage.getItem("physicalMandate") == "true" ? 1 : 0;
					objData["bankName"] = localStorage.getItem("enachBankName") || objData["bankName"];

					if (localStorage.getItem("campaign_id") == "96") {
						objData["pay_pc"] = 1;
					}
					const showConsumerCode = localStorage.getItem("showConsumerCode");
					if (showConsumerCode == 1) {
						objData["consumer_code"] = this.state.consumer_code;
					}
					console.log("bac************************", showConsumerCode, this.state.consumer_code);

					if (showConsumerCode == 1 && this.state.consumer_code == "") {
						this.setState({ errorCd: 1, isWarning: 1, alert_msg: "Consumer code is empty please reload and try again.", showLoader: 0 });

						return;
					}

					if(this.props.empdata.department && this.props.empdata.department.toLowerCase() == 'sales - jd mart') {
						objData["untilCancelFlag"] = 1;
					}

					AllocationActions.submitEcsMandate(this.props.params.parentid, objData, this.state.empData, this.state.filePath);
					// }
				} else if (data["data"]["errorCode"] == 3) {
					let warning_action = this.state.mandateDataExist == 1 ? "proceed" : "";
					this.setState({
						showLoader: 0,
						alert_msg: data.data.mandate_response ? data.data.mandate_response["MESSAGE"] : data["data"]["errorMsg"],
						isWarning: 1,
						warning_action: warning_action,
					});
				} else {
					this.setState({
						showLoader: 0,
						alert_msg: data.data.mandate_response ? data.data.mandate_response["MESSAGE"] : data["data"]["errorMsg"],
						isWarning: 1,
					});
				}

				break;
			case "receiveBankInfo":
				// console.log('###***', data.data);
				this.setState({ setLoader: 0 });
				if (data.data["ERRCODE"] == 1) {
					if (typeof data.data["DATA"] !== "undefined") {
						var innerJson = JSON.parse(data.data["DATA"]);
					} else if (typeof data.data["BANK_NAMES"] !== "undefined") {
						// console.log(355, data.data["BANK_NAMES"], typeof data.data["BANK_NAMES"]);

						//var bank_data = JSON.parse(data.data['BANK_NAMES']);
						var innerJson = [];
						innerJson["bank_name"] = data.data["BANK_NAMES"][0];
						innerJson["bank_city"] = this.state.formData.bankcity;
						innerJson["bank_branch"] = this.state.formData.bankBranch;
						innerJson["bank_address"] = this.state.formData.bankAdd;
						innerJson["ifsc_code"] = this.state.formData.bankIfsc;
						innerJson["is_nach_ecs"] = 0;
						innerJson["bank_code"] = 1;
						innerJson["micr"] = "micr" in this.state.formData ? this.state.formData.micr : "";

						this.setState({ disableBankBranch: 0 });
					}
					if (innerJson["is_nach_ecs"] == 0 && innerJson["bank_code"] != 1) {
						this.setState({ isNACH: 0, errorCd: 1, errMsg: "Bank does not participate in NACH! Kindly select a different Bank to proceed.", invalidBankDetails: true });
					} else {
						this.setState({ isNACH: 1, invalidBankDetails: false });
					}
					// console.log('innerJson - ',innerJson);
					if (!innerJson["ifsc_code"]) {
						// console.log('grrrrrrwgwrgefge')
						var newVals = helperFunc.assign(this.state.formData);
						newVals["bankcity"] = "";
						// newVals['bankName'] = innerJson['bank_name'];
						// newVals['bankName'] = '';
						// newVals['bankBranch'] = '';
						// newVals['bankAdd'] = '';
						// newVals['bankIfsc'] = '';
						// newVals["bank_code"] = '';

						newVals["bankcity"] = "bank_city" in innerJson ? innerJson["bank_city"] : newVals["bankName"];
						newVals["bankName"] = "bank_name" in innerJson ? innerJson["bank_name"] : newVals["bankName"];
						newVals["bankBranch"] = "bank_branch" in innerJson ? innerJson["bank_branch"].replace(/[\"'/]/g, "") : newVals["bankBranch"];
						newVals["bankAdd"] = "bank_address" in innerJson ? innerJson["bank_address"].replace(/[\"'/]/g, "") : newVals["bankAdd"];
						newVals["bankIfsc"] = "";
						newVals["bank_code"] = "bank_code" in innerJson ? innerJson["bank_code"] : newVals["bank_code"];
						newVals["micr"] = "micr" in innerJson ? innerJson["micr"] : newVals["micr"];

						// newVals['micr'] = '';
						// this.setState({ errorCd: 1, errMsg: 'Please connect with Accounts team to add IFSC Code.', formData: newVals, invalidMICR: false, invalidIfsc: true});
						this.setState({ formData: newVals, invalidMICR: false, invalidIfsc: true });
					} else {
						var newVals = helperFunc.assign(this.state.formData);
						newVals["bankcity"] = innerJson["bank_city"];
						newVals["bankName"] = innerJson["bank_name"];
						newVals["bankBranch"] = innerJson["bank_branch"].replace(/[\"'/]/g, "");
						newVals["bankAdd"] = innerJson["bank_address"].replace(/[\"'/]/g, "");
						newVals["bankIfsc"] = !innerJson["ifsc_code"] ? "" : innerJson["ifsc_code"];
						newVals["bank_code"] = innerJson["bank_code"];
						newVals["micr"] = innerJson["micr"];
						this.setState({ formData: newVals, showOverlay: 1, invalidMICR: false, invalidIfsc: false });
						setTimeout(() => {
							helperFunc.handleInputBlurLoad();
							helperFunc.handleInputBlurLoadPOE();
						}, 300);
					}
				} else {
					if (this.state.mandate === "true" && this.state.formData.micr != "") {
						this.setState({ errorCd: 1, errMsg: "MICR is not valid", invalidMICR: true });
						return false;
					}
				}
				break;
			case "receiveBankMicr":
				// console.log('***', data.data);
				this.setState({ setLoader: 0 });
				if (data.data["ERRCODE"] == 1) {
					var innerJson = JSON.parse(data.data["DATA"]);

					if (innerJson["is_nach_ecs"] == 0) {
						this.setState({ isNACH: 0, errorCd: 1, errMsg: "Bank does not participate in NACH! Kindly select a different Bank to proceed.", invalidBankDetails: true });
					} else {
						this.setState({ isNACH: 1, showOverlay: 1, invalidBankDetails: false });
					}
					// console.log('innerJson - ',innerJson, this.state);
					if (!innerJson["ifsc_code"]) {
						// console.log('1111111')
						var newVals = JSON.parse(JSON.stringify(this.state.formData));
						// newVals['micr'] = '';
						// newVals['bankAdd'] = '';
						// newVals['bankIfsc'] = '';
						// newVals["bank_code"] = '';

						// newVals['bankName'] = '';
						// newVals['bankBranch'] = '';
						// newVals['bankAdd'] = '';
						// newVals['bankIfsc'] = '';
						// newVals["bank_code"] = '';
						newVals["bankcity"] = "bank_city" in innerJson ? innerJson["bank_city"] : newVals["bankName"];
						newVals["bankName"] = "bank_name" in innerJson ? innerJson["bank_name"] : newVals["bankName"];
						newVals["bankBranch"] = "bank_branch" in innerJson ? innerJson["bank_branch"].replace(/[\"'/]/g, "") : newVals["bankBranch"];
						newVals["bankAdd"] = "bank_address" in innerJson ? innerJson["bank_address"].replace(/[\"'/]/g, "") : newVals["bankAdd"];
						// newVals['bankIfsc'] = '';
						newVals["bank_code"] = "bank_code" in innerJson ? innerJson["bank_code"] : newVals["bank_code"];
						newVals["micr"] = "micr" in innerJson ? innerJson["micr"] : newVals["micr"];
						// newVals['micr'] = '';
						// console.log('newVals - ',newVals)

						this.setState({ formData: newVals, invalidIfsc: true });
					} else {
						// console.log('22222222222')
						var newVals = helperFunc.assign(this.state.formData);
						newVals["bankAdd"] = innerJson["bank_address"].replace(/[\"'/]/g, "");
						newVals["bankIfsc"] = !innerJson["ifsc_code"] ? "" : innerJson["ifsc_code"];
						newVals["micr"] = innerJson["micr"];
						this.setState({ formData: newVals, invalidMICR: false, invalidIfsc: false }, function() {
							helperFunc.handleInputBlurLoad();
							helperFunc.handleInputBlurLoadPOE();
						});
					}
				} else {
					this.setState({ errorCd: 1, errMsg: data.data["MESSAGE"], invalidMICR: true, invalidBankDetails: false });
				}
				break;
			case "receiveBankAutoSuggest":
				if (data.data["ERRCODE"] == 1) {
					this.setState({
						suggestions: JSON.parse(data.data.DATA),
						autoLoader: 0,
					});
				} else {
					this.setState({ errorCd: 1, errMsg: data.data["MESSAGE"], autoLoader: 0, suggestions: [] });
				}
				break;
			case "contractInfo":
				if (data["data"]["tableData"]["errorCode"] == 0) {
					var mobileNum = "",
						emailId = "",
						authorityDetails = [];
					var conData = data["data"]["tableData"];
					if (typeof conData["mobile"]["data"] !== "undefined" && typeof conData["email"]["data"] !== "undefined" && conData["mobile"]["data"][0]["mobile"] != "" && conData["email"]["data"][0]["email"] != "") {
						var BreakException = {};
						try {
							Object.keys(conData["mobile"]["data"]).map(function(value, key) {
								if (conData["mobile"]["data"][key]["mobile"] != "") {
									mobileNum = conData["mobile"]["data"][key]["mobile"];
									throw BreakException;
								}
							});
						} catch (e) {
							if (e !== BreakException) throw e;
						}
						BreakException = {};
						try {
							Object.keys(conData["email"]["data"]).map(function(value, key) {
								if (conData["email"]["data"][key]["email"] != "") {
									emailId = conData["email"]["data"][key]["email"];
									throw BreakException;
								}
							});
						} catch (e) {
							if (e !== BreakException) throw e;
						}
					} else if (typeof conData["mobile"]["data"] !== "undefined" && conData["mobile"]["data"][0]["mobile"] != "") {
						var BreakException = {};
						try {
							Object.keys(conData["mobile"]["data"]).map(function(value, key) {
								if (conData["mobile"]["data"][key]["mobile"] != "") {
									mobileNum = conData["mobile"]["data"][key]["mobile"];
									throw BreakException;
								}
							});
						} catch (e) {
							if (e !== BreakException) throw e;
						}
					} else if (typeof conData["email"]["data"] !== "undefined" && conData["email"]["data"][0]["email"] != "") {
						var BreakException = {};
						try {
							Object.keys(conData["email"]["data"]).map(function(value, key) {
								if (conData["email"]["data"][key]["email"] != "") {
									emailId = conData["email"]["data"][key]["email"];
									throw BreakException;
								}
							});
						} catch (e) {
							if (e !== BreakException) throw e;
						}
					}

					if (conData["data"]["employee_info"] != "" && conData["data"]["employee_info"] != null && typeof conData["data"]["employee_info"]["owner"] !== "undefined" && Object.keys(conData["data"]["employee_info"]["owner"]).length > 0) {
						for (var keyPerson in conData["data"]["employee_info"]["owner"]) {
							let sal = conData["data"]["employee_info"]["owner"][keyPerson]["sal"] != undefined && conData["data"]["employee_info"]["owner"][keyPerson]["sal"] != null ? conData["data"]["employee_info"]["owner"][keyPerson]["sal"] : "";
							let name = conData["data"]["employee_info"]["owner"][keyPerson]["name"] != undefined && conData["data"]["employee_info"]["owner"][keyPerson]["name"] != null ? conData["data"]["employee_info"]["owner"][keyPerson]["name"] : "";
							let des = conData["data"]["employee_info"]["owner"][keyPerson]["des"] != undefined && conData["data"]["employee_info"]["owner"][keyPerson]["des"] != null ? conData["data"]["employee_info"]["owner"][keyPerson]["des"] : "";
							let authDetails = des != "" ? sal + " " + name + "(" + des + ")" : sal + " " + name;
							authorityDetails.push(authDetails);
						}
					}
					var newEmpVals = {};
					newEmpVals = helperFunc.assign(this.state.empData);
					newEmpVals["authority_details"] = authorityDetails.join(",");
					this.setState({ mobileNum: mobileNum, emailId: emailId, companyName: data["data"]["tableData"]["data"]["companyname"], empData: newEmpVals });
				}
				break;
			case "receiveGetVersion":
				if (data["data"] != undefined) {
					var newVals = {};
					newVals = helperFunc.assign(this.state.formData);
					newVals["version"] = data["data"]["version"];
					this.setState({ formData: newVals, version: data["data"]["version"], showLoader: 1 }, () => {
						AllocationActions.getMandateInfo(this.props.params.parentid, this.state.formData.version, this.state.formData.transaction_id, this.state.formData.master_transaction_id, this.state.empData.empname);
					});
				} else {
					this.setState({
						showLoader: 0,
						modalTitle: "Mandate Page Error !!",
						modalMsg: "Sorry you cannot proceed further as Version is missing.",
						showModal: 1,
						version: "",
					});
				}
				break;
			case "receiveSubmitMandate":
				this.setState({ showLoader: 0 });

				// console.log('******************', this.state, data['data']);

				// if(this.state.iciciMandate == 1 && ['10083404', '10015427', '10015416', '10029347'].includes(EMPCODE)) {
				if (this.state.iciciMandate == 1) {
					let mandateResponse = "mandate_response" in data["data"] ? data["data"]["mandate_response"] : data["data"]["e_mandate_response"];

					if (data["data"]["errorCode"] == 0) {
						// this.setState({ isWarning: 1, alert_msg: "Link sent successfully", warning_action:"proceed", warning_type: "success" });
						this.setState({ currentSection: "tokenTransactionLinkDetails" });
						// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
					} else if (data["data"]["errorCode"] == 1) {
						this.setState({ isWarning: 1, alert_msg: data["data"]["errorMsg"] });
					} else if (data["data"]["errorCode"] == 2) {
						if (this.IsJsonString(mandateResponse["MESSAGE"])) {
							errStrArr = JSON.parse(mandateResponse["MESSAGE"]);
							this.setState({ isWarning: 1, alert_msg: errStrArr[0] });
							return false;
						} else {
							this.setState({ isWarning: 1, alert_msg: mandateResponse["MESSAGE"] });
							return false;
						}
					} else if (data["data"]["errorCode"] == 3) {
						this.setState({ isWarning: 1, alert_msg: data["data"]["errorMsg"][0] });
					} else if (data["data"]["errorCode"] == 4) {
						this.setState({ isWarning: 1, alert_msg: mandateResponse["MESSAGE"], warning_action: "proceed", warning_type: "success" });
						return false;
						// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
					}
				} else {
					// mandate verification failed
					if (data["data"]["errorCode"] == 2) {
						var errStrArr = [];
						if (this.IsJsonString(mandateResponse["MESSAGE"])) {
							errStrArr = JSON.parse(mandateResponse["MESSAGE"]);
							this.setState({ errorArrCd: 1, errMsgArr: errStrArr });
							return false;
						} else {
							this.setState({ errorCd: 1, errMsg: mandateResponse["MESSAGE"] });
							return false;
						}
					} else if (data["data"]["errorCode"] == 0) {
						// mandate verified and saved
						// if(this.state.successFlag ==1){
						// 	this.setState({warning_action:"proceed",isWarning: 1,alert_msg:this.state.successMsg,warning_type: "success"});
						// 	return false
						// }else{
						// 	hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
						// }

						if (this.state.currentSection !== "physicalMandate") {
							this.setState({ currentSection: "tokenTransactionLinkDetails" });
						} else {
							hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
							// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
						}
					}
					// mandate verification success but not saved
					else if (data["data"]["errorCode"] == 1) {
						this.setState({ errorCd: 1, errMsg: data["data"]["errorMsg"] });
					}
				}
				break;
			case "submitSiMandate":
				this.setState({ showLoader: 0 });

				// mandate verification failed
				if (data["data"]["errorCode"] == 2) {
					var errStrArr = [];
					if (this.IsJsonString(data["data"]["mandate_response"]["MESSAGE"])) {
						errStrArr = JSON.parse(data["data"]["mandate_response"]["MESSAGE"]);
						this.setState({ errorArrCd: 1, errMsgArr: errStrArr });
						return false;
					} else {
						this.setState({ errorCd: 1, errMsg: data.data["mandate_response"]["MESSAGE"] });
						return false;
					}
				} else if (data["data"]["errorCode"] == 0) {
					// mandate verified and saved
					if (data["data"]["e_mandate"] == 1 || data["data"]["e_mandate"] == 3) {
						//netbankfact_modal:true removed by krushi to skip net banking
						this.setState({ netbankfactConfirm_modal: true, e_mandate_data: data["data"]["e_mandate_data"], eNachDigital: data["data"]["e_mandate"] });
					} else {
						// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
						hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
						// Changes done foe rupee payment as per new cc si floa changes. If its required then uncomment the below function and comment the above redirection
						// AllocationActions.getCcPaymentDetails(this.props.params.parentid,this.props.params['master_transaction_id'],"getCcPaymentDetails")
						this.setState({ showLoader: 1 });
					}
					// else{
					// 	hashHistory.push("/make-payment/"+this.props.params.parentid+"/"+this.props.params.master_transaction_id);
					// }
				}
				// mandate verification success but not saved
				else if (data["data"]["errorCode"] == 1) {
					this.setState({ errorCd: 1, errMsg: data["data"]["errorMsg"] });
				}
				// mandate verification failed
				// else if (data['data']['errorCode'] == 2) {
				// 	var errStrArr = [];
				// 	if (this.IsJsonString(data['data']['mandate_response']['MESSAGE'])) {
				// 		errStrArr = JSON.parse(data['data']['mandate_response']['MESSAGE']);
				// 		this.setState({ errorArrCd: 1, errMsgArr: errStrArr });
				// 	} else {
				// 		this.setState({ errorCd: 1, errMsg: data.data['mandate_response']['MESSAGE'] });
				// 	}
				// }
				break;
			case "receiveEcsMinAmt":
				if (data["data"]["errorCode"] == 0) {
					var newVals = helperFunc.assign(this.state.formData);
					let allowDateEdit = 0,
						ecsAdvAmount = 0;

					data["data"]["data"].forEach((element) => {
						// if (element.item_id == '34' || element.item_id == 34 || element.item_id == '37' || element.item_id == 37) {
						// 	newVals['lt_emi'] = element.emi_duration ? element.emi_duration : 12;
						// }

						if (element.emi_duration != "" && element.emi_duration > 0 && element.emi_duration <= 12) {
							newVals["lt_emi"] = element.emi_duration ? element.emi_duration : 12;
						}
						// console.log(element.emi_duration+ "---" +newVals['lt_emi']);
						// if(element.item_dp_count == 3){
						// 	allowDateEdit = 1;
						// }
						ecsAdvAmount += Number(element.process_amount);
					});
					if (localStorage.getItem("ecsAdvAmount") != null && localStorage.getItem("ecsAdvAmount") != undefined && Math.round(ecsAdvAmount) == localStorage.getItem("ecsAdvAmount")) {
						allowDateEdit = 1;
					}

					var cartData = data["data"]["data"][0];

					newVals["ecsAmount"] = Math.round(cartData["ecs_amount"] * 1.18); // adding GST
					newVals["minEcsAmt"] = Math.round(cartData["ecs_amount"] * 1.18); // adding GST
					newVals["ecsWithoutTax"] = cartData["ecs_amount"]; // without adding GST [changes done by krushi]
					// newVals["ecsMaxAmount"] = (Math.floor(newVals["minEcsAmt"] / 5000) + 1) * 5000 || 5000; // Logic by Ravindra Daroge
					newVals["ecsMaxAmount"] = newVals["ecsAmount"];
					newVals["transaction_id"] = cartData["transaction_id"];
					newVals["master_transaction_id"] = this.props.params["master_transaction_id"];
					this.setState({ formData: newVals, showLoader: 1, allowDateEdit: allowDateEdit }, () => {
						AllocationActions.getVersion(this.props.params.parentid);
						helperFunc.handleInputBlurLoad();
					});
				} else {
					this.setState({
						showLoader: 0,
						modalTitle: "Mandate Page Error !!",
						modalMsg: "Sorry you cannot proceed further as Min.Ecs Amount or TransactionId is missing.",
						showModal: 1,
					});
				}
				break;
			case "getMandateInfo":
				this.setState({ setLoader: 1 }, () => {
					AllocationActions.getMasterTransactionDetails(this.props.params.parentid, EMPCODE);
				});
				if (data["data"]["errorCode"] == 0) {
					if (data["data"]["source"] == "accountDetails") {
						var mandate_data = data["data"]["result"];
						this.setState({
							showLoader: 0,
							isWarning: 0,
							isNACH: 1,
						});
						this.setStateForMount(mandate_data, data["data"]["source"], this.state.tabType);
					} else {
						var mandate_data = data["data"]["result"];
						let oneRupeeFlag = 0,
							mandateParams = JSON.parse(mandate_data["mandate_params"]);
						if (mandate_data["mandate_type"].toLowerCase() == "si") {
							oneRupeeFlag = mandateParams["auto_payment_id"] != undefined && mandateParams["auto_payment_id"] != "" ? 0 : 1;
						}
						this.setState(
							{
								showLoader: 0,
								isWarning: 0,
								isNACH: 1,
								tabType: mandate_data["mandate_type"].toLowerCase() == "ecs" ? 2 : 3,
								currentTab: mandate_data["mandate_type"].toLowerCase() == "ecs" ? "ecsmandate" : "simandate",
								oneRupeeFlag: oneRupeeFlag,
							},
							() => {
								this.setStateForMount(mandate_data, data["data"]["source"], this.state.tabType);
							},
						);
					}
					// console.log("rsult",data['data']['result']);
					if (data["data"]["result"]["is_active"] != undefined && data["data"]["result"]["is_active"] == "1" && data["data"]["result"]["mandate_type"] != undefined && data["data"]["result"]["mandate_type"].toLowerCase() == "ecs") {
						this.setState({ mandateDataExist: 1 });
					}
					// console.log("rsult",data['data']['result']);
				} else {
					if (localStorage.getItem("siMandateObj") != null && localStorage.getItem("siMandateObj") != undefined) {
						var siMandateObj = JSON.parse(localStorage.getItem("siMandateObj")),
							tempSiStart = "";
						Object.keys(siMandateObj).map(function(key, value) {
							tempSiStart = siMandateObj["tempSiStart"];
						});
						var tempObj = helperFunc.assign(this.state.formData);
						tempObj["siDebitDate"] = siMandateObj["siDebitDate"];
						tempObj["siStartDate"] = tempSiStart;
						tempObj["compName"] = this.state.companyName;
						tempObj["version"] = this.state.version;

						// Set Bank Name selected on enach eligible page
						tempObj["bankName"] = localStorage.getItem("enachBankName") || "";

						this.setState({ formData: tempObj, tempSiStart: tempSiStart });
					} else {
						var tempObj = helperFunc.assign(this.state.formData);
						// Set Bank Name selected on enach eligible page
						tempObj["bankName"] = localStorage.getItem("enachBankName") || "";
						this.setState({
							formData: tempObj,
							disableBankBranch: 0,
						});
					}
					this.setState({
						showLoader: 0,
					});
				}
				this.setState({ showLoader: 1 });
				AllocationActions.fetchPaymentSummary(this.props.params.parentid, this.state.formData.master_transaction_id, EMPCODE);
				// AllocationActions.getCcPaymentDetails(this.props.params.parentid,this.props.params.master_transaction_id,"getCcPaymentDetails")
				break;
			case "fetchPaymentSummary":
				this.setState({ showLoader: 0 });
				if (data["data"]["errorCode"] == 0) {
					var currentTime = data["data"]["result"]["stats"]["current_time"];
					var serverDate = currentTime.split(" ")[0];
					var nextDate = serverDate,
						allowSkipMandate = 1,
						maxServerDate = ""; //make allowSkipMandate = 0 allow skip mandate
					// if(helperFunc.ecsDateException(localStorage.getItem("datacity").toLowerCase()) == 1){
					// 	nextDate ="2020-07-05";
					// }
					//if(data['data']['zone']!=undefined && helperFunc.ecsDateException(data['data']['zone'].toLowerCase()) == 1 && this.state.allowDateEdit == 1){

					if (this.state.allowDateEdit == 1) {
						nextDate = data["data"]["result"]["stats"]["max_time"];
						maxServerDate = data["data"]["result"]["stats"]["max_time"];
					} else {
						maxServerDate = serverDate;
					}
					if (new Date(serverDate) >= new Date(nextDate)) {
						nextDate = serverDate;
					}
					var newVals = {},
						cardValidated = 0;
					newVals = helperFunc.assign(this.state.formData);
					newVals["startDate"] = serverDate;
					newVals["siStartDate"] = serverDate;
					Object.keys(data["data"]["result"]["jdpay_data"]).map(function(key, val) {
						if (data["data"]["result"]["jdpay_data"][key]["isActive"] == 1 && parseInt(data["data"]["result"]["jdpay_data"][key]["amount"]) == 1) {
							cardValidated = 1;
						}
					});
					if (data["data"]["zone"] != undefined && helperFunc.skipMandateCities(data["data"]["zone"].toLowerCase()) == 1) {
						allowSkipMandate = 1;
					}
					this.setState({
						formData: newVals,
						tempStart: serverDate,
						tempMinStart: serverDate,
						tempMaxStart: nextDate,
						serverTime: currentTime.replace(/-/g, "/"),
						jdPayObj: data["data"]["result"]["jdpay_data"],
						cardValidated: cardValidated,
						allowSkipMandate: allowSkipMandate,
						maxServerDate: maxServerDate,
						tempSiStart: serverDate,
					});

					data["data"]["result"]["payment_data"].forEach((instr) => {
						if (instr["instrument_type"] == "cheque") {
							this.setState({
								chequeInstrAdded: 1,
								chequeInstrAccNo: instr["cheque_details"]["bank_acc_number"],
								chequeInstrMicr: instr["cheque_details"]["bank_micr"],
								chequeInstrAccType: instr["cheque_details"]["bank_acc_type"],
							});
						}
					});
				}
				break;
			case "getMasterTransactionDetails":
				this.setState({ setLoader: 0, handleEnach: 0 });
				if (data["data"]["errorCode"] != undefined && data["data"]["errorCode"] == 0) {
					if (data["data"]["transaction_extra_details"]["errorCode"] != undefined && data["data"]["transaction_extra_details"]["errorCode"] == 0 && parseInt(data["data"]["data"]["tds_percent"]) > 0 && data["data"]["data"]["ecs_tds_applied"] == "1") {
						let ecsTdsDeductAmt = 0;
						var newVals = {};
						newVals = helperFunc.assign(this.state.formData);
						ecsTdsDeductAmt = (parseFloat(data["data"]["data"]["tds_percent"]) / 100) * parseFloat(newVals["ecsWithoutTax"]);
						newVals["ecsAmount"] = Math.round(parseFloat(newVals["ecsAmount"]) - parseFloat(ecsTdsDeductAmt));
						newVals["minEcsAmt"] = Math.round(parseFloat(newVals["minEcsAmt"]) - parseFloat(ecsTdsDeductAmt));
						newVals["ecsMaxAmount"] = (Math.floor(newVals["minEcsAmt"] / 5000) + 1) * 5000 || 5000; // Logic by Ravindra Daroge
						this.setState({ formData: newVals });
					}
					if (data["data"]["data"]["pg_pay_mode"] == "ccsi") {
						this.setState({ payType: data["data"]["data"]["pg_pay_mode"], tabType: 3, currentTab: "simandate" });
					} else if (data["data"]["data"]["pg_pay_mode"] == "dmp") {
						this.setState({ payType: data["data"]["data"]["pg_pay_mode"], tabType: 2, currentTab: "ecsmandate" });
					} else {
						this.setState({ payType: data["data"]["data"]["pg_pay_mode"] });
					}
				} else if (data["data"]["errorCode"] != undefined && data["data"]["errorCode"] == 1) {
					this.setState({
						modalTitle: "Transaction API Error !!",
						modalMsg: data["data"]["errorStatus"],
						showModal: 1,
					});
					return false;
				} else {
					this.setState({
						modalTitle: "Transaction API Error !!",
						modalMsg: "Error while fetching transaction details please reload and try again.",
						showModal: 1,
					});
					return false;
				}
				setTimeout(() => {
					helperFunc.handleInputBlurLoad();
				}, 300);
				break;
			case "makePaymentVerify":
				this.setState({ setLoader: 0 });
				if (data["data"]["errorCode"] == 0) {
					this.setState({ transId: data["data"]["transId"], paymentUrl: data["data"]["redUrl"] }, function() {
						if (localStorage.getItem("bypass") != 1) {
							$("#paymentFormMakePayment").submit();
						} else {
							window.open("../genio_services/pay_transaction.php?s=E&t=" + data["data"]["transId"], "_blank", "width=1000,height=800,left=200,top=100");
						}
					});
				} else if (data["data"]["errorCode"] == 2) {
					this.setState({ showExpiryPop: true });
				} else {
					this.setState({ transId: "", errorCd: 1, errMsg: data["data"]["errorMsg"] });
				}
				break;
			case "getCcPaymentDetails":
				if (data["data"]["errorCode"] == 0) {
					let thisObjNew = this,
						tempCardNumber = "";
					Object.keys(data["data"]["data"]).map(function(key, value) {
						if (
							data["data"]["data"][key]["auto_payment_id"] != undefined &&
							data["data"]["data"][key]["auto_payment_id"] != "" &&
							data["data"]["data"][key]["is_selected"] == 1 &&
							data["data"]["data"][key]["master_transaction_id"] == thisObjNew.props.params.master_transaction_id
						) {
							var tempCcsiObj = helperFunc.assign(thisObjNew.state.formData);
							tempCcsiObj["auto_payment_id"] = data["data"]["data"][key]["auto_payment_id"];
							// tempCcsiObj['mobile_num']      = thisObjNew.state.mobileNum;//This should be handled This is creating issue for mobile numbers order changed in bform
							tempCcsiObj["is_zion"] = 1;
							tempCardNumber = data["data"]["data"][key]["card_number"];
							thisObjNew.setState(
								{
									formData: tempCcsiObj,
									creditCardNumber: tempCardNumber,
								},
								() => {
									setTimeout(() => {
										helperFunc.handleInputBlurLoad();
										helperFunc.handleInputBlurLoadPOE();
									}, 250);
									// thisObjNew.savePayment(thisObjNew.state.currentTab)
								},
							);
						}
					});
				}

				break;
			case "validate_acno_api":
				this.setState({ setLoader: 0 });

				if (data["data"]["ERRCODE"] != 1) {
					let alertMsg = "Unable to verify bank details!";

					if (data["data"]["MESSAGE"]) {
						alertMsg = data["data"]["MESSAGE"];
					}

					this.setState({
						isWarning: 1,
						alert_msg: alertMsg,
					});
					return false;
				} else {
					this.setState(
						{
							validateACNO: 0,
						},
						() => {
							this.savePayment(this.state.saveTab);
						},
					);
				}
				// if(data['data']['errorCode'] == 0 &&  data['data']['data'][0]['auto_payment_id']!=undefined &&  data['data']['data'][0]['auto_payment_id']!=""){
				// 	hashHistory.push("/make-payment/"+this.props.params.parentid+"/"+this.props.params.master_transaction_id);
				// }else{
				// var objData = {};
				// objData['companyName'] = this.state.companyName;
				// objData['source'] = "SI Mandate";
				// AllocationActions.makePaymentVerify(this.props.params.parentid, 1, this.state.mobileNum, this.state.emailId, 1, 0, 0, this.state.empData.empcode, this.state.empData.empname, this.props.params['master_transaction_id'], objData);
				// this.setState({ showLoader: 1 });
				// }
				break;
			case "verifyEcsMandate":
				this.setState({ showLoader: 0 });
				// console.log('******************', this.state, data['data']);
				// mandate verification failed
				if (data["data"]["errorCode"] == 2) {
					// this.setState({ errorCd: 1, errMsg: data["data"]["errorMsg"] || "Unable to verify bank details" });
					// return false;

					var errStrArr = [];
					if (this.IsJsonString(data['data']['mandate_response']['MESSAGE'])) {
						errStrArr = JSON.parse(data['data']['mandate_response']['MESSAGE']);
						this.setState({ errorCd: 1, errMsg: errStrArr[0] });
						return false
					} else {
						this.setState({ errorCd: 1,  errMsg: data["data"]["errorMsg"] || "Unable to verify bank details" });
						return false
					}
				} else if (data["data"]["errorCode"] == 0) {
					// mandate verified and saved

					if (this.state.formData.bankName != "" && this.state.formData.bankName.split(" ").indexOf("IC123ICI") > -1) {
						if (this.state.formData.accNo.length != 12) {
							this.setState({ errorCd: 1, errMsg: "Account number length should be 12 digits" });
							return false;
						}
						// if(this.state.enachEligible == 1 && ['10083404', '10015427', '10015416', '10029347'].includes(EMPCODE)) {
						if (this.state.enachEligible == 1) {
							this.setState({ iciciMandate: 1, handleEnach: 1, hideShowEnach: 1, hideDOBOnVerifyAPI: true }, () => {
								helperFunc.handleInputBlurLoad();
								this.savePayment(this.state.currentTab);
							});
							// helperFunc.handleInputBlurLoad();
							return false;
						}
					}
					if (data["data"]["e_mandate"] == 1 || data["data"]["e_mandate"] == 3) {
						//netbankfact_modal:true removed by krushi to skip net banking
						let hideShowEnach = 1;
						let netbankfactConfirm_modal = true;

						if (this.state.enachEligible == 1) {
							data["data"]["e_mandate_data"]["mp_portal"] = 0;
						} else {
							data["data"]["e_mandate_data"]["mp_portal"] = 2;
							hideShowEnach = 0;
							netbankfactConfirm_modal = false;
						} // added by sandeep to have enach enable by default
						let obj1 = JSON.parse(JSON.stringify(data["data"]["e_mandate_data"]));
						let eMandateDataObj = JSON.parse(JSON.stringify(this.state.e_mandate_data));
						obj1["mobile_number"] = "mobile_number" in eMandateDataObj ? eMandateDataObj["mobile_number"] : obj1["mobile_number"];
						obj1["email_id"] = "email_id" in eMandateDataObj ? eMandateDataObj["email_id"] : obj1["email_id"];
						obj1["dob"] = "dob" in eMandateDataObj ? eMandateDataObj["dob"] : obj1["dob"];
						this.setState({ netbankfactConfirm_modal: netbankfactConfirm_modal, e_mandate_data: obj1, eNachDigital: data["data"]["e_mandate"], handleEnach: 1, hideShowEnach: hideShowEnach }, () => {
							this.savePayment(this.state.currentTab);
						});
					} else if (this.state.payType == "dmp" || (this.state.payType == null && this.state.tabType == 2)) {
						if (this.state.enachEligible == 1) {
							this.setState({ errorCd: 1, errMsg: "Please re-check your Enach -Eligibility" });
							return false;
						} else {
							this.setState({ handleEnach: 1, hideShowEnach: 0, netbankfactConfirm_modal: false });

							if (this.checkPhysicalMandate()) {
								this.showPhysicalMandate();
							}

							// this.setState({
							// 	showModal: 2,
							// 	modalTitle: 'E-Nach',
							// 	modalMsg: 'Your bank does not qualify for E-Nach. Click Ok to continue with Physical Mandate',
							// 	handleEnach:1,
							// 	hideShowEnach:0,
							// 	netbankfactConfirm_modal: false
							// });
						}
					} else {
						// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
						this.setState({ handleEnach: 1, hideShowEnach: 0, netbankfactConfirm_modal: false });
					}
				}
				// mandate verification success but not saved
				else if (data["data"]["errorCode"] == 1) {
					this.setState({ errorCd: 1, errMsg: data["data"]["errorStatus"] });
				}
				break;

			case "verifyEcsMandate_bankDetails":
				// console.log('data - ', data);
				this.setState({ showLoader: 0 });

				if (data.data.errorCode == 0) {
					this.setState({ currentSection: "accountAndEmiDetails" });
				} else {
					if (this.state.enachEligible == 0) {
						this.setState({ currentSection: "accountAndEmiDetails" });
					} else {
						this.setState({ errorCd: 1, errMsg: "Please re-check your Enach -Eligibility" });
						return false;
					}
				}
				break;

			case "skipMandate":
				this.setState({ showLoader: 0 });
				if (data["data"]["errorCode"] == 0) {
					// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
					hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
				} else {
					this.setState({ isWarning: 1, errMsg: data["data"]["errorMsg"] });
					return false;
				}
				break;
			case "verifyMandateCardCcsi":
				this.setState({ showLoader: 0 });
				if (data["data"]["errorCode"] == 0) {
					this.savePayment(this.state.currentTab);
				} else {
					this.setState({ isWarning: 1, alert_msg: "Please Add Card for SI Verification" });
					return false;
				}
			case "deActivateInstrumentJDPay":
				if (data["data"]["errorCode"] == 0) {
					this.setState({ isWarning: 1, alert_msg: "Verification link deleted Successfully", warning_type: "success" });
					AllocationActions.fetchPaymentSummary(this.props.params.parentid, this.state.formData.master_transaction_id, EMPCODE);
				} else {
					this.setState({ isWarning: 1, alert_msg: data["data"]["errorStatus"], showLoader: 0 });
					return false;
				}
				break;
			// customer code taking data
			case "consumerCode":
				if (data.data.data.ERRCODE == 1) {
					console.log("data from customer code action", data.data.data);

					this.setState({ consumer_code: data.data.data.CONSUMER_CODE });
				} else {
					this.setState({ isWarning: 1, errMsg: data.data.data.MESSAGE });
					return false;
				}
				break;
		}
	} // onChange Ends

	verifyACNODetails(currentTab) {
		var objData = {};
		objData.parentid = this.props.params.parentid;
		objData.ecs_acc_name = this.state.formData.holderName;
		objData.ecs_acc_number = this.state.formData.confAccNo;
		objData.ecs_ifsc = this.state.formData.bankIfsc;
		this.setState({ setLoader: 1, validateACNO: 1, saveTab: currentTab }, () => {
			AllocationActionsLite.validate_acno_api(objData, "validate_acno_api");
		});
	}

	setStateForMount(mandate_data, source, type) {
		// console.log("ecsmandate");
		// console.log(mandate_data, source, type);
		if (source == "shadow") {
			var mandate_params = JSON.parse(mandate_data["mandate_params"]);
			if (type == 2) {
				// ECS Handling
				var tempObj = helperFunc.assign(this.state.formData);
				let mandate_ecs_preview = "";
				let mandate_nach_preview = "";
				let mandate_cheque_preview = "";
				(tempObj["holderName"] = mandate_params.ecs_acc_name),
					(tempObj["confHolderName"] = mandate_params.ecs_acc_name),
					(tempObj["accNo"] = mandate_params.ecs_acc_number),
					(tempObj["confAccNo"] = mandate_params.ecs_acc_number),
					(tempObj["accountType"] = mandate_params.ecs_acc_type),
					(tempObj["user_pay_mode"] = mandate_params.user_pay_mode),
					(tempObj["modeOpr"] = mandate_params.ecs_acc_oprn_mode),
					(tempObj["bankcity"] = mandate_params.ecs_bank_city),
					(tempObj["bankName"] = mandate_params.ecs_bank_name),
					(tempObj["bankBranch"] = mandate_params.ecs_bank_branch.replace(/[\"'/]/g, "")),
					//tempObj['bankAdd']			=  mandate_params.bankAdd,
					(tempObj["micr"] = mandate_params.ecs_bank_micr),
					(tempObj["bankIfsc"] = mandate_params.ecs_ifsc),
					(tempObj["startDate"] = this.state.tempStart),
					(tempObj["invoiceEmail"] = mandate_params.invoice_email),
					(tempObj["DebitFrequency"] = "30"),
					(tempObj["debitDates"] = mandate_params.cycledays),
					(tempObj["compName"] = mandate_params.companyname),
					(tempObj["outletCheck"] = mandate_params.multi_city_outlet),
					(tempObj["nach_image_preview"] = mandate_params.mandate_copy),
					(mandate_nach_preview = mandate_params.mandate_copy),
					(tempObj["nach_image_show"] = mandate_params.mandate_copy != undefined && mandate_params.mandate_copy != "" ? 1 : 0),
					(tempObj["ecs_image_preview"] = mandate_params.ack_image != undefined && mandate_params.ack_image != "" ? mandate_params.ack_image : ""),
					(mandate_ecs_preview = mandate_params.ack_image != undefined && mandate_params.ack_image != "" ? mandate_params.ack_image : ""),
					(tempObj["ecs_image_show"] = mandate_params.ack_image != undefined && mandate_params.ack_image != "" ? 1 : 0),
					(tempObj["cheque_image_show"] = mandate_params.cheque_image != undefined && mandate_params.cheque_image != "" ? 1 : 0);
				(tempObj["cheque_image_preview"] = mandate_params.cheque_image != undefined && mandate_params.cheque_image != "" ? mandate_params.cheque_image : ""),
					(mandate_cheque_preview = mandate_params.cheque_image != undefined && mandate_params.cheque_image != "" ? mandate_params.cheque_image : "");

				if (localStorage.getItem("siMandateObj") != null && localStorage.getItem("siMandateObj") != undefined) {
					var siMandateObj = JSON.parse(localStorage.getItem("siMandateObj")),
						tempSiStart = "";
					Object.keys(siMandateObj).map(function(key, value) {
						tempSiStart = siMandateObj["tempSiStart"];
						tempObj["siStartDate"] = siMandateObj["tempSiStart"];
						tempObj["siDebitDate"] = siMandateObj["siDebitDate"];
					});
					this.setState({ tempSiStart: tempSiStart });
				}
				this.setState(
					{
						formData: tempObj,
						mandate_nach_preview,
						mandate_ecs_preview,
						mandate_cheque_preview,
						ecs_image_remove: 1,
						nach_image_remove: 1,
						cheque_image_remove: 1,
					},
					() => {
						this.getBankDetails(1, "receiveBankInfo");
						setTimeout(() => {
							helperFunc.handleInputBlurLoad();
							helperFunc.handleInputBlurLoadPOE();
						}, 250);
					},
				);
			} else if (type == 3) {
				//Code for SI
				var tempObj = helperFunc.assign(this.state.formData),
					tempSiStart = "";
				(tempObj["cardHolderName"] = mandate_params.si_acc_name),
					(tempObj["confCardHolderName"] = mandate_params.si_acc_name),
					(tempObj["cardNumber"] = mandate_params.card_num),
					(tempObj["confCardNumber"] = mandate_params.card_num),
					(tempObj["cardType"] = mandate_params.card_type),
					(tempObj["cardBankName"] = mandate_params.si_bank_name),
					(tempObj["expMonth"] = mandate_params.expiry_month),
					(tempObj["expYear"] = mandate_params.expiry_year),
					(tempObj["siDebFrequency"] = mandate_params.cycle_selected),
					(tempObj["siDebitDate"] = mandate_params.cycledays),
					(tempObj["siStartDate"] = mandate_params.si_start_date);
				(tempObj["siEndDate"] = ""),
					(tempObj["compName"] = mandate_params.companyname),
					// (tempObj["auto_payment_id"] = mandate_params.auto_payment_id || ""),
					(tempObj["mobile_num"] = mandate_params.mobile_num || ""),
					// (tempObj["is_zion"] = mandate_params.is_zion || "");
				tempSiStart = mandate_params.si_start_date;
				if (localStorage.getItem("siMandateObj") != null && localStorage.getItem("siMandateObj") != undefined) {
					var siMandateObj = JSON.parse(localStorage.getItem("siMandateObj"));
					if (siMandateObj["tempSiStart"] != "") {
						tempSiStart = siMandateObj["tempSiStart"];
						tempObj["siStartDate"] = siMandateObj["tempSiStart"];
						tempObj["siDebitDate"] = siMandateObj["siDebitDate"];
					}
				}
				this.setState(
					{
						formData: tempObj,
						tempSiStart: tempSiStart,
					},
					() => {
						setTimeout(() => {
							helperFunc.handleInputBlurLoad();
							helperFunc.handleInputBlurLoadPOE();
						}, 250);
					},
				);
			}
		} else {
			var tempObj = helperFunc.assign(this.state.formData);
			// console.log("mandate_data");
			(tempObj["holderName"] = mandate_data.account_name),
				(tempObj["confHolderName"] = mandate_data.account_name),
				(tempObj["accNo"] = mandate_data.account_number),
				(tempObj["confAccNo"] = mandate_data.account_number),
				(tempObj["accountType"] = mandate_data.account_type),
				(tempObj["user_pay_mode"] = mandate_data.user_pay_mode),
				// tempObj['bankcity']			=  mandate_data.branch_location,
				// tempObj['bankName']			=  mandate_data.bank_name,
				// tempObj['bankBranch']		=  mandate_data.bank_branch,
				// tempObj['bankIfsc']			=  mandate_data.ifsc_code,
				(tempObj["startDate"] = ""),
				(tempObj["DebitFrequency"] = "30"),
				(tempObj["auto_payment_id"] = "");
			tempObj["mobile_num"] = "";
			tempObj["is_zion"] = "";

			this.setState(
				{
					formData: tempObj,
				},
				() => {
					//this.getBankDetails(2,'receiveBankMicr');
					setTimeout(() => {
						helperFunc.handleInputBlurLoad();
						helperFunc.handleInputBlurLoadPOE();
					}, 250);
				},
			);
		}
	}

	tabShow(id) {
		this.setState({ currentTab: id, errorCd: 0, errMsg: "", errorArrCd: 0, errMsgArr: [] });
		$(".tab-content .tab-pane").removeClass("active");
		$("#" + id).addClass("active");
		$(".nav-tabs li").removeClass("active");
		$("." + id).addClass("active");
	}
	accordionDisp(event) {
		if (
			false ===
			$(event.target)
				.closest(".panel")
				.find(".panel-collapse")
				.is(":visible")
		) {
			$(".panel-collapse").slideUp(300);
		}
		$(event.target)
			.closest(".panel")
			.find(".panel-collapse")
			.slideToggle(300);
		if (
			$(event.target)
				.closest(".panel")
				.find(".headAcc")
				.hasClass("collapsed")
		) {
			$(".headAcc").addClass("collapsed");
			$(event.target)
				.closest(".panel")
				.find(".headAcc")
				.removeClass("collapsed");
		} else {
			$(".headAcc").addClass("collapsed");
			$(event.target)
				.closest(".panel")
				.find(".headAcc")
				.addClass("collapsed");
		}
	}
	accordionDisp_save(id) {
		if (id == "si_accnt") {
			$("#crddtls").slideUp(300);
			if ($("#" + id).hasClass("collapsed")) {
				$("#" + id)
					.closest(".panel")
					.find(".panel-collapse")
					.slideToggle(300);
				$(".headAcc").addClass("collapsed");
				$("#" + id)
					.closest(".panel")
					.find(".headAcc")
					.removeClass("collapsed");
			}
		} else {
			var accrd_ids = ["accntAccord", "bankAccord", "ecsAccord", "nachAccord"];
			var panel_ids = ["accdata", "bankdata", "ecsdtls", "nachdata"];
			var index = accrd_ids.indexOf(id);
			if (index > -1) {
				accrd_ids.splice(index, 1);
				panel_ids.splice(index, 1);
			}
			panel_ids.forEach((element, key) => {
				$("#" + element).slideUp(300);
			});
			if ($("#" + id).hasClass("collapsed")) {
				$("#" + id)
					.closest(".panel")
					.find(".panel-collapse")
					.slideToggle(300);
				$(".headAcc").addClass("collapsed");
				$("#" + id)
					.closest(".panel")
					.find(".headAcc")
					.removeClass("collapsed");
			}
		}
	}
	setNetBankingData(e, param) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.netbankfact_data);
		if (param == "mobile") {
			newVals[param] = e.target.value.replace(/[^0-9\.]/g, "");
			this.setState({ netbankfact_data: newVals }, () => {});
		} else if (param == "email") {
			newVals[param] = e.target.value;
			this.setState({ netbankfact_data: newVals }, () => {});
		} else {
			newVals[param] = e.target.value;
			this.setState({ netbankfact_data: newVals }, () => {});
		}
	}
	digitalMandateUpdater(e, param, type) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.e_mandate_data);
		if (param == "mp_portal" && type == 2) {
			newVals[param] = e.target.value;
			this.setState({ errMsg: "", errorCd: 0, errorArrCd: 0, errMsgArr: [], e_mandate_data: newVals });
			return false;
		}
		this.setState({ errMsg: "", errorCd: 0, errorArrCd: 0, errMsgArr: [] });
		if (param == "mobile_number") {
			newVals[param] = e.target.value.replace(/[^0-9\.]/g, "");
			this.setState({ e_mandate_data: newVals });
		} else if (param == "mp_portal") {
			// if (type == 1) {
			// 	newVals['emandate_close_url'] = window.encodeURIComponent(paths.GENIO_LITE + "make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
			// 	newVals['eredirect_url'] = window.encodeURIComponent(paths.GENIO_LITE + "make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
			// }
			if (type == 1) {
				newVals["emandate_close_url"] = window.encodeURIComponent(paths.GENIO_LITE + "payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
				newVals["eredirect_url"] = window.encodeURIComponent(paths.GENIO_LITE + "payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
			}
			newVals[param] = e.target.value;
			this.setState({ e_mandate_data: newVals });
		} else {
			newVals[param] = e.target.value;
			this.setState({ e_mandate_data: newVals });
		}
		setTimeout(() => {
			helperFunc.handleInputBlurLoad();
			helperFunc.handleInputBlurLoadPOE();
		}, 500);
	}
	formUpdater(e, param) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.formData);
		this.setState({ errMsg: "", errorCd: 0, errorArrCd: 0, errMsgArr: [] });
		if (param == "cardHolderName") {
			if (newVals["cardHolderName"] != e.target.value) {
				newVals["confCardHolderName"] = "";
			}
		} else if (param == "cardNumber") {
			if (newVals["cardNumber"] != e.target.value) {
				newVals["confCardNumber"] = "";
			}
		}
		if (param == "holderName") {
			if (newVals["holderName"] != e.target.value) {
				newVals["confHolderName"] = "";
			}
		}
		if (param == "accNo") {
			if (newVals["accNo"] != e.target.value) {
				newVals["confAccNo"] = "";
			}
		}
		if (param == "bankAdd") {
			if (newVals["bank_code"] == 1) {
				newVals[param] = e.target.value.replace(/[^0-9\.]/g, "");
				this.setState({ formData: newVals });
			} else {
				newVals[param] = "";
				this.setState({ formData: newVals });
			}
		}
		if (param == "cardNumber" || param == "confCardNumber" || param == "ecsMaxAmount" || param == "ecsMaxAmount_conf") {
			newVals[param] = e.target.value.replace(/[^0-9\.]/g, "");
			this.setState({ formData: newVals });
		} else if (param == "ecsAmount") {
			newVals[param] = e.target.value.replace(/[^0-9\.]/g, "");
			newVals["ecsMaxAmount"] = (Math.floor(newVals[param] / 5000) + 1) * 5000 || 5000;
			this.setState({ formData: newVals });
		} else if (param == "bankIfsc" || param == "accNo" || param == "confAccNo") {
			newVals[param] = e.target.value.replace(/[^0-9a-zA-Z]/g, "");
			this.setState({ formData: newVals }, function() {});
		} else if (param == "DebitFrequency") {
			newVals["debitDates"] = "";
			//this.createDebitDates(e.target.value);  // commented by Vivek
			if (e.target.value == "fn") {
				newVals[param] = 15;
			} else if (e.target.value == "wk") {
				newVals[param] = 7;
			} else if (e.target.value == "mn") {
				newVals[param] = 30;
			}
			this.setState({ formData: newVals });
		} else if (param == "debitDates" || param == "siDebitDate") {
			//Hard-coded values working only for monthly ECS.
			newVals["debitDates"] = e.target.value;
			newVals["siDebitDate"] = e.target.value;
			newVals["DebitFrequency"] = 30;
			this.setState({ formData: newVals });
		} else if (param == "outletCheck") {
			newVals["outletCheck"] = newVals["outletCheck"] == 1 ? 0 : 1;
		} else {
			newVals[param] = e.target.value;
			this.setState({ formData: newVals });
		}
		if (newVals["expYear"] != "" && newVals["expMonth"] != "") {
			var month = "",
				day = "";
			switch (newVals["expMonth"]) {
				case "1":
					(month = "01"), (day = "31");
					break;
				case "2":
					(month = "02"), (day = "28");
					break;
				case "3":
					(month = "03"), (day = "31");
					break;
				case "4":
					(month = "04"), (day = "30");
					break;
				case "5":
					(month = "05"), (day = "31");
					break;
				case "6":
					(month = "06"), (day = "30");
					break;
				case "7":
					(month = "07"), (day = "31");
					break;
				case "8":
					(month = "08"), (day = "31");
					break;
				case "9":
					(month = "09"), (day = "30");
					break;
				case "10":
					(month = "10"), (day = "31");
					break;
				case "11":
					(month = "11"), (day = "30");
					break;
				case "12":
					(month = "12"), (day = "31");
					break;
			}
			newVals["siEndDate"] = newVals["expYear"] + "-" + month + "-" + day;
		}
		// recheck
		newVals["compName"] = this.state.companyName;
		newVals["version"] = this.state.version;
		this.setState({ formData: newVals }, function() {});
		setTimeout(() => {
			helperFunc.handleInputBlurLoad();
			helperFunc.handleInputBlurLoadPOE();
		}, 500);
	} // formUpdater Ends

	handleDateStart(value, formated_value) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.formData);
		newVals["startDate"] = formated_value;
		this.setState({ formData: newVals, tempStart: value });
	}

	handleDobChange(value, formated_value) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.e_mandate_data);
		newVals["dob"] = formated_value;
		this.setState({ e_mandate_data: newVals });
	}

	handleBlur(e, param) {
		if (e.target.name === "accountNumber") {
			$(e.target).attr("type", "password");
		}
		if (this.state.chequeInstrAdded == 1 && param == "accNo" && e.target.value != this.state.chequeInstrAccNo) {
			this.setState({ errMsg: "Cheque account must match Mandate account. Delete Cheque if you wish to edit Mandate details.", errorCd: 1 });
			return false;
		}
		helperFunc.handleInputBlur(e);
	}
	handleFocus(e) {
		var targetObj = e.target;
		setTimeout(function() {
			$(targetObj).attr("type", "text");
		}, 500);
		helperFunc.handleInputFocus(e);
	}
	getBankDetails(param, actionFlag) {
		this.setState({ setLoader: 1, showOverlay: 0 });
		AllocationActions.fetchBankInfo(param, this.state.formData, actionFlag);
	}

	/*SI Functions*/
	handleSIDate(value, formated_value) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.formData);
		newVals["siStartDate"] = formated_value;
		this.setState({ formData: newVals, tempSiStart: formated_value });
	}
	setCreditCardYear() {
		var expYearArr = [],
			currentYear = new Date().getFullYear();
		expYearArr.push(currentYear);
		for (var i = 1; i <= 10; i++) {
			expYearArr.push(currentYear + i);
		}
		this.setState({ expYearArr: expYearArr });
	}
	validName(str) {
		var urlRegEx = /^[a-zA-Z\ .]+$/;
		var pattern = new RegExp(urlRegEx);
		if (!pattern.test(str)) {
			return 0;
		} else {
			return 1;
		}
	}

	/*ECS Functions*/

	validateAcctHolderName(holderName, confHolderName) {
		var urlRegEx = /^[a-zA-Z0-9\.\s ]*$/;
		var pattern = new RegExp(urlRegEx);
		if (!holderName) {
			var retData = { errMsg: "Please enter Account Holders Name!", errorCd: 1 };
			return retData;
		}
		// if (!confHolderName) {
		// 	var retData = { errMsg: "Please Confirm Account Holders Name!", errorCd: 1 }
		// 	return retData;
		// }
		if (holderName.length < 3) {
			let retData = { errMsg: "Account Holder Name should be at least 3 characters.", errorCd: 1 };
			return retData;
		}
		if (!pattern.test(holderName)) {
			var retData = { errMsg: "Account Holders Name can only accept alphabets, numbers ,space( ) and period(.)", errorCd: 1 };
			return retData;
		}
		// if (!pattern.test(confHolderName)) {
		// 	var retData = { errMsg: "Confirm Account Holders Name can only accept alphabets, numbers ,space( ) and period(.)", errorCd: 1 }
		// 	return retData;
		// }
		// if (holderName.toLowerCase() !== confHolderName.toLowerCase()) {
		// 	var retData = { errMsg: "Account Holders Name and Confirm Account Holders Name must be same!", errorCd: 1 }
		// 	return retData;
		// }
		else {
			var retData = { errMsg: "", errorCd: 0 };
			return retData;
		}
	}

	validateAcctNumber(mainText, verifyText) {
		var urlRegEx = /^[a-zA-Z0-9]*$/;
		var pattern = new RegExp(urlRegEx);

		var mainTextLen = mainText.length;
		var verifyTextLen = verifyText.length;

		// mandate acc no must match cheque acc if cheque instrument already added, else remove chq
		if (this.state.chequeInstrAdded == 1 && mainText != this.state.chequeInstrAccNo) {
			var retData = { errMsg: "Cheque account must match Mandate account. Delete Cheque if you wish to edit Mandate details.", errorCd: 1 };
			return retData;
		}

		if (!mainText) {
			var retData = { errMsg: "Please enter Account Number!", errorCd: 1 };
			return retData;
		}
		if (!verifyText) {
			var retData = { errMsg: "Please Confirm Account Number!", errorCd: 1 };
			return retData;
		}
		if (!pattern.test(mainText)) {
			var retData = { errMsg: "Account Number can only accept digits (0-9) and (a-Z)!", errorCd: 1 };
			return retData;
		}
		if (!pattern.test(verifyText)) {
			var retData = { errMsg: "Confirm Account Number can only accept digits (0-9) and (a-Z)!", errorCd: 1 };
			return retData;
		}
		if (mainText !== verifyText) {
			var retData = { errMsg: "Account Number and Confirm Account Number must be same!", errorCd: 1 };
			return retData;
		}
		if ((mainTextLen < 2 || mainTextLen >= 24) && (verifyTextLen < 2 || verifyTextLen >= 24)) {
			var retData = { errMsg: "Account Number should be between 2 characters and 24 characters!", errorCd: 1 };
			return retData;
		} else {
			var retData = { errMsg: "", errorCd: 0 };
			return retData;
		}
	}
	ValidateEmail(mainText) {
		var urlRegEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi;
		var pattern = new RegExp(urlRegEx);
		/*
			if(!mainText){
			var retData = {errMsg:"Please enter Email Address!",errorCd:1}
			return retData;
		}*/
		if (mainText && !pattern.test(mainText)) {
			var retData = { errMsg: "Please enter a valid Email Address!", errorCd: 1 };
			return retData;
		} else {
			var retData = { errMsg: "", errorCd: 0 };
			return retData;
		}
	}
	ValidateStartDate(mainText) {
		var urlRegEx = /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}$/;
		var pattern = new RegExp(urlRegEx);
		if (!mainText) {
			var retData = { errMsg: "Please Select ECS Start Date!", errorCd: 1 };
			return retData;
		}
		if (new Date(mainText) > new Date(this.state.maxServerDate)) {
			var retData = { errMsg: "Please Select ECS Start Date within " + this.state.maxServerDate, errorCd: 1 };
			return retData;
		}
		if (!pattern.test(mainText)) {
			var retData = { errMsg: "Please Enter ECS Start Date in YYYY-MM-DD Format!", errorCd: 1 };
			return retData;
		} else {
			var retData = { errMsg: "", errorCd: 0 };
			return retData;
		}
	}
	ValidateIfsc(mainText) {
		var urlRegEx = /^[a-zA-Z0-9]*$/;
		var pattern = new RegExp(urlRegEx);
		if (!mainText) {
			var retData = { errMsg: "Please enter IFSC code", errorCd: 1 };
			return retData;
		}
		if (!pattern.test(mainText)) {
			var retData = { errMsg: "IFSC Code can only accept digits (0-9) and (a-Z)!", errorCd: 1 };
			return retData;
		} else {
			var retData = { errMsg: "", errorCd: 0 };
			return retData;
		}
	}
	validateMicr(mainText) {
		// mandate micr must match cheque micr if cheque instrument already added, else remove chq
		if (this.state.chequeInstrAdded == 1 && mainText != this.state.chequeInstrMicr) {
			var retData = { errMsg: "Cheque MICR must match mandate MICR.", errorCd: 1 };
			return retData;
		} else {
			var retData = { errMsg: "", errorCd: 0 };
			return retData;
		}
	}

	savePayment_ecs(currentTab, currentSection) {
		const {
			holderName,
			confHolderName,
			accNo,
			confAccNo,
			accountType,
			modeOpr,
			bankcity,
			bankName,
			bankBranch,
			bankAdd,
			bankIfsc,
			micr,
			invoiceEmail,
			startDate,
			DebitFrequency,
			debitDates,
			ecsAmount,
			minEcsAmt,
			ecsMaxAmount,
			ecsMaxAmount_conf,
			nach_image_preview,
			ecs_image_preview,
			cheque_image_preview,
		} = this.state.formData;
		var thisObj = this;
		thisObj.setState({ errMsg: "", errorCd: 0, errorArrCd: 0, errMsgArr: [] });
		// if(this.state.iciciMandate == 1 && this.state.enachEligible == 1 && ['10083404', '10015427', '10015416', '10029347'].includes(EMPCODE)) {
		if (this.state.iciciMandate == 1 && this.state.enachEligible == 1) {
			return true;
		}
		if (!this.checkPhysicalMandate() && this.state.empData.manage_campaign == 0 && this.state.handleEnach == 1) {
			if (!nach_image_preview || nach_image_preview == "") {
				thisObj.setState({ alert_msg: "Please Upload NACH Photo!", errorCd: 1, isWarning: 1 }, () => {
					setTimeout(() => {
						// thisObj.setState({ errMsg: '', errorCd: 0 });
					}, 10000);
				});
				// thisObj.accordionDisp_save('nachAccord');
				// thisObj.refs.ecsMaxAmount.style['border-bottom'] = '';
				// thisObj.refs.ecsMaxAmount.focus();
				return false;
			} else {
				return true;
			}
		}
		let validationArr = [];
		if (currentSection === "bankDetails") {
			// validationArr = ['bankcity', 'bankName','bankAdd', 'bankBranch', 'bankIfsc', 'micr'];
			validationArr = ["bankName", "micr", "bankcity", "bankBranch", "bankAdd", "bankIfsc"];
		} else if (currentSection === "accountAndEmiDetails") {
			// validationArr = ['acctHolderName', 'acctNumber', 'accountType', 'modeOpr', 'startDate', 'DebitFrequency', 'debitDates', 'invoiceEmail', 'ecsAmount', 'ecsMaxAmount', 'mobile_number', 'email_id', 'nachImage', 'Success'];
			if (this.checkEcsEligible()) {
				validationArr = ["acctHolderName", "acctNumber", "accountType", "user_pay_mode", "modeOpr", "debitDates", "mobile_number", "email_id"];
				// if((this.state.netbankfactConfirm_modal == true || this.state.hideShowEnach == 1 || this.state.iciciMandate == 1 || ('bankName' in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1))){
				// 	validationArr.push('dob');
				// }
				if (this.state.enachEligible == 1 && "bankName" in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(" ").indexOf("IC123ICI") > -1) {
					validationArr.push("dob");
				}
				validationArr.push("Success");
			} else {
				validationArr = ["acctHolderName", "acctNumber", "accountType", "modeOpr", "debitDates"];
				if (this.state.enachEligible == 1 && "bankName" in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(" ").indexOf("IC123ICI") > -1) {
					validationArr.push("dob");
				}
				validationArr.push("nachImage");
				validationArr.push("Success");
			}
		}
		for (let value of validationArr) {
			if (value == "acctHolderName") {
				var data = thisObj.validateAcctHolderName(holderName);
				if (data.errorCd == 1) {
					thisObj.setState({ errMsg: data.errMsg, errorCd: 1 });
					thisObj.accordionDisp_save("accntAccord");
					thisObj.refs.holderName.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.confHolderName.value = "";
					thisObj.refs.holderName.focus();
					return false;
				} else {
					thisObj.refs.holderName.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "acctNumber") {
				var data = thisObj.validateAcctNumber(accNo, confAccNo);
				if (data.errorCd == 1) {
					thisObj.setState({ errMsg: data.errMsg, errorCd: 1 });
					thisObj.accordionDisp_save("accntAccord");
					thisObj.refs.accNo.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.confAccNoRef.value = "";
					thisObj.refs.accNo.focus();
					return false;
				} else {
					thisObj.refs.accNo.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "accountType") {
				console.log("value===>",this.state.formData.accountType)
				if(this.state.formData.accountType == 'Current' && this.state.popupOpen == 1){
					thisObj.setState({ alertPop:1  });
					return false;
				}
				if (!this.state.formData.accountType) {
					thisObj.setState({ errMsg: "Please select Account Type!", errorCd: 1 });
					thisObj.accordionDisp_save("accntAccord");
					thisObj.refs.selectAccType.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.selectAccType.focus();
					return false;
				} else if (this.state.chequeInstrAdded == 1 && this.state.formData.accountType.toLowerCase() != this.state.chequeInstrAccType) {
					thisObj.setState({ errMsg: "Cheque account type must match Mandate account type.", errorCd: 1 });
					thisObj.accordionDisp_save("accntAccord");
					thisObj.refs.selectAccType.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.selectAccType.focus();
					return false;
				} else {
					thisObj.refs.selectAccType.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "user_pay_mode" && this.state.mandate === "false") {
				if (!this.state.formData.user_pay_mode) {
					thisObj.setState({ errMsg: "Please select Payment Type!", errorCd: 1 });
					thisObj.accordionDisp_save("accntAccord");
					thisObj.refs.selectPayType.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.selectPayType.focus();
					return false;
				} else {
					thisObj.refs.selectPayType.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "user_pay_mode" && this.state.mandate === "true") {
				// continue
			} else if (value == "modeOpr" && this.state.mandate === "true") {
				if (!modeOpr) {
					thisObj.setState({ errMsg: "Please select Mode of Operation!", errorCd: 1 });
					thisObj.accordionDisp_save("accntAccord");
					thisObj.refs.modeOfOprn.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.modeOfOprn.focus();
					return false;
				} else {
					thisObj.refs.modeOfOprn.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "modeOpr" && this.state.mandate === "false") {
				// continue
			} else if (value == "bankcity") {
				if (!bankcity) {
					thisObj.setState({ errMsg: "Please enter Bank City!", errorCd: 1 });
					thisObj.accordionDisp_save("bankAccord");
					//thisObj.refs.bankCity.style['border-bottom'] = '1px solid #c73939';
					$("#" + value).css({ "border-bottom": "1px solid #c73939" });
					$("#" + value).focus();
					return false;
				} else {
					$("#" + value).css({ "border-bottom": "1px solid #ddd" });
				}
			} else if (value == "bankName") {
				if (!bankName) {
					thisObj.setState({ errMsg: "Please enter Bank Name!", errorCd: 1 });
					thisObj.accordionDisp_save("bankAccord");
					//thisObj.refs.bankNameSel.style['border-bottom'] = '1px solid #c73939';
					$("#" + value).css({ "border-bottom": "1px solid #c73939" });
					$("#" + value).focus();
					return false;
				} else {
					$("#" + value).css({ "border-bottom": "1px solid #ddd" });
				}
			} else if (value == "bankBranch") {
				if (!bankBranch) {
					thisObj.setState({ errMsg: "Please enter Branch Name!", errorCd: 1 });
					thisObj.accordionDisp_save("bankAccord");
					$("#" + value).css({ "border-bottom": "1px solid #c73939" });
					$("#" + value).focus();

					return false;
				} else {
					$("#" + value).css({ "border-bottom": "1px solid #ddd" });
				}
			} else if (value == "bankAdd") {
				if (!bankAdd) {
					thisObj.setState({ errMsg: "Please enter Bank Address!", errorCd: 1 });
					thisObj.accordionDisp_save("bankAccord");
					$("#" + value).css({ "border-bottom": "1px solid #c73939" });
					$("#" + value).focus();

					return false;
				} else {
					$("#" + value).css({ "border-bottom": "1px solid #ddd" });
				}
			} else if (value == "bankIfsc") {
				var data = thisObj.ValidateIfsc(bankIfsc);
				if (data.errorCd == 1) {
					thisObj.setState({ errMsg: data.errMsg, errorCd: 1 });
					thisObj.accordionDisp_save("bankAccord");
					thisObj.refs.bankIfscCodeSel.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.bankIfscCodeSel.focus();
					return false;
				} else {
					thisObj.refs.bankIfscCodeSel.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "micr") {
				var data = thisObj.validateMicr(micr);

				if (micr === "" || this.state.invalidMICR === true) {
					thisObj.setState({ errMsg: "MICR is not valid", errorCd: 1 });
					thisObj.accordionDisp_save("bankAccord");
					thisObj.refs.bankMicrSel.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.bankMicrSel.focus();
					return false;
				} else if (data.errorCd == 1) {
					thisObj.setState({ errMsg: data.errMsg, errorCd: 1 });
					thisObj.accordionDisp_save("bankAccord");
					thisObj.refs.bankMicrSel.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.bankMicrSel.focus();
					return false;
				} else {
					thisObj.refs.bankMicrSel.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "startDate") {
				var data = thisObj.ValidateStartDate(startDate);
				if (data.errorCd == 1) {
					thisObj.setState({ errMsg: data.errMsg, errorCd: 1 });
					thisObj.accordionDisp_save("ecsAccord");
					thisObj.refs.strtDateEcsDetails.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.strtDateEcsDetails.focus();
					return false;
				} else {
					thisObj.refs.strtDateEcsDetails.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "invoiceEmail") {
				var data = thisObj.ValidateEmail(invoiceEmail);
				if (data.errorCd == 1) {
					thisObj.setState({ errMsg: data.errMsg, errorCd: 1 });
					thisObj.accordionDisp_save("ecsAccord");
					thisObj.refs.invoiceEmailAddrRef.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.invoiceEmailAddrRef.focus();
					return false;
				} else {
					thisObj.refs.invoiceEmailAddrRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "DebitFrequency") {
				if (!DebitFrequency) {
					thisObj.setState({ errMsg: "Please select Debit Frequency!", errorCd: 1 });
					thisObj.accordionDisp_save("ecsAccord");
					thisObj.refs.debitFrequencyRef.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.debitFrequencyRef.focus();
					return false;
				} else {
					thisObj.refs.debitFrequencyRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "debitDates") {
				if (!debitDates && parseInt(debitDates) != 7) {
					thisObj.setState({ errMsg: "Please select Debit Date!", errorCd: 1 });
					thisObj.accordionDisp_save("ecsAccord");
					thisObj.refs.debitDatesRef.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.debitDatesRef.focus();
					return false;
				} else {
					thisObj.refs.debitDatesRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "ecsAmount") {
				if (!ecsAmount || parseFloat(ecsAmount) < minEcsAmt) {
					thisObj.setState({ errMsg: "Please enter Minimum Billing Amount greater than " + parseFloat(minEcsAmt) + " !", errorCd: 1 });
					thisObj.accordionDisp_save("ecsAccord");
					thisObj.refs.ecsAmtRef.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.ecsAmtRef.focus();
					return false;
				} else {
					thisObj.refs.ecsAmtRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value == "ecsMaxAmount") {
				if (!ecsMaxAmount || ecsMaxAmount < minEcsAmt || ecsMaxAmount != ecsMaxAmount_conf) {
					thisObj.setState({ errMsg: "Please enter  Maximum Billing Amount which is greater than " + parseFloat(minEcsAmt) + " or Confirmation Maximum Billing Amount does not match Maximum Billing Amount!", errorCd: 1 }, () => {
						setTimeout(() => {
							thisObj.setState({ errMsg: "", errorCd: 0 });
						}, 10000);
					});
					thisObj.accordionDisp_save("ecsAccord");
					thisObj.refs.ecsMaxAmount.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.ecsMaxAmount.focus();
					return false;
				} else {
					thisObj.refs.ecsAmtRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
				}
			} else if (value === "mobile_number") {
				if (!("mobile_number" in this.state.e_mandate_data) || !helperFunc.validateMobile(this.state.e_mandate_data.mobile_number)) {
					thisObj.setState({ errorCd: 1, errMsg: "Please enter a valid mobile number", handleEnach: 0 });
					thisObj.refs.mobile_number.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.mobile_number.focus();
					return false;
				} else {
					thisObj.refs.mobile_number.style["border-bottom"] = "1px solid #ddd";
					thisObj.setState({ errorCd: 0, errMsg: "" });
				}
			} else if (value === "email_id") {
				var data = thisObj.ValidateEmail(this.state.e_mandate_data.email_id);

				if (bankName.split(" ").indexOf("IC123ICI") > -1) {
					if (!("email_id" in this.state.e_mandate_data && this.state.e_mandate_data.email_id && data.errorCd == 0)) {
						// thisObj.setState({ errorCd: 1, isWarning: 1, alert_msg: 'Please enter a valid Email Address!', handleEnach: 0 });
						thisObj.setState({ errorCd: 1, errMsg: "Please enter a valid Email Address!", handleEnach: 0 });
						thisObj.refs.email_id.style["border-bottom"] = "1px solid #c73939";
						thisObj.refs.email_id.focus();
						return false;
					} else {
						thisObj.refs.email_id.style["border-bottom"] = "1px solid #ddd";
						thisObj.refs.mobile_number.style["border-bottom"] = "1px solid #ddd";
						thisObj.setState({ errorCd: 0, errMsg: "" });
					}
				} else {
					if (!("email_id" in this.state.e_mandate_data) || !this.state.e_mandate_data.email_id) {
						thisObj.refs.email_id.style["border-bottom"] = "1px solid #ddd";
						thisObj.refs.mobile_number.style["border-bottom"] = "1px solid #ddd";
						thisObj.setState({ errorCd: 0, errMsg: "" });
					} else if ("email__id" in this.state.e_mandate_data && this.state.e_mandate_data.email_id) {
						if (data.errorCd == 0) {
							thisObj.setState({ errorCd: 1, errMsg: "Please enter a valid Email Address!!", handleEnach: 0 });
							thisObj.refs.email_id.style["border-bottom"] = "1px solid #c73939";
							thisObj.refs.email_id.focus();
							return false;
						} else {
							thisObj.refs.email_id.style["border-bottom"] = "1px solid #ddd";
							thisObj.refs.mobile_number.style["border-bottom"] = "1px solid #ddd";
							thisObj.setState({ errorCd: 0, errMsg: "" });
						}
					}
				}

				// if ( !(('email_id' in this.state.e_mandate_data) && this.state.e_mandate_data.email_id != '' && data.errorCd == 0)) {
				// 	// thisObj.setState({ errorCd: 1, isWarning: 1, alert_msg: 'Please enter a valid Email Address!', handleEnach: 0 });
				// 	thisObj.setState({ errorCd: 1, errMsg: 'Please enter a valid Email Address!', handleEnach: 0 });
				// 	thisObj.refs.email_id.style['border-bottom'] = '1px solid #c73939';
				// 	thisObj.refs.email_id.focus();
				// 	return false;
				// } else {
				// 	thisObj.refs.email_id.style['border-bottom'] = '1px solid #ddd';
				// 	thisObj.refs.mobile_number.style['border-bottom'] = '1px solid #ddd';
				// 	thisObj.setState({ errorCd: 0, errMsg: '' });

				// }
			} else if (value === "dob") {
				if (!("dob" in this.state.e_mandate_data && this.state.e_mandate_data.dob)) {
					thisObj.setState({ errorCd: 1, errMsg: "Please enter Date of Birth", handleEnach: 0 });
					return false;
				} else {
					thisObj.setState({ errorCd: 0, errMsg: "" });
				}
			}
			// else if (this.state.empData.manage_campaign == 0 && value == 'nachImage' && this.state.handleEnach == 1) {
			// 	if (!nach_image_preview || nach_image_preview == "") {
			// 		thisObj.setState({ errMsg: "Please Upload NACH Photo!", errorCd: 1 }, () => {
			// 			setTimeout(() => {
			// 				thisObj.setState({ errMsg: '', errorCd: 0 });
			// 			}, 10000);
			// 		});
			// 		thisObj.accordionDisp_save('nachAccord');
			// 		thisObj.refs.ecsMaxAmount.style['border-bottom'] = '';
			// 		thisObj.refs.ecsMaxAmount.focus();
			// 		return false;
			// 	} else {
			// 		thisObj.refs.ecsAmtRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
			// 	}
			// }
			else if (this.state.empData.manage_campaign == 0 && this.state.isNACH == 0 && this.state.mandate == true) {
				thisObj.setState({ errMsg: "Bank does not participate in NACH! Kindly select a different bank to proceed.", errorCd: 1 });
				return false;
			} else {
				return true;
			}
		}
	}

	savePayment_si(currentTab) {
		this.setState({ errorCd: 0, errMsg: "", errorArrCd: 0, errMsgArr: [] });
		// if(this.state.formData.cardHolderName == ""){
		// 	this.refs.cardHolderNameRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardHolderNameRef.focus();
		// 	this.refs.confCardHolderNameRef.value = '';
		// 	this.setState({errorCd:1,errMsg:"Please enter Card Holder Name!"});
		// 	return false;
		// }else if(this.state.formData.cardHolderName == "" && this.state.formData.confCardHolderName != "") {
		// 	this.refs.cardHolderNameRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardHolderNameRef.focus();
		// 	this.refs.confCardHolderNameRef.value = '';
		// 	this.setState({checkSubForm:1,checkSubFormMsg:"Please enter Card Holder Name first!"});
		// 	return false;
		// }else if((this.state.formData.cardHolderName).length < 3) {
		// 	this.refs.cardHolderNameRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardHolderNameRef.focus();
		// 	this.refs.confCardHolderNameRef.value = '';
		// 	this.setState({errorCd:1,errMsg:"Card Holders Name should be at least three (3) characters long!"});
		// 	return false;
		// }else if(this.validName(this.state.formData.cardHolderName) == 0) {
		// 	this.refs.cardHolderNameRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardHolderNameRef.focus();
		// 	this.refs.confCardHolderNameRef.value = '';
		// 	this.setState({errorCd:1,errMsg:"Card Holders Name can only accept alphabets, space( ), period(.)!"});
		// 	return false;
		// }else if(this.state.formData.cardHolderName != "" && (this.state.formData.cardHolderName != this.state.formData.confCardHolderName)){
		// 	this.refs.cardHolderNameRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardHolderNameRef.focus();
		// 	this.refs.confCardHolderNameRef.value = '';
		// 	this.setState({errorCd:1,errMsg:"Please confirm Card Holder Name!"});
		// 	return false;
		// }else{
		// 	this.refs.cardHolderNameRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		// if(this.state.formData.cardNumber == ""){
		// 	this.refs.cardNumberRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardNumberRef.focus();this
		// 	this.refs.confCardNumberRef.value = '';
		// 	this.setState({errorCd:1,errMsg:"Please enter Card Number!"});
		// 	return false;
		// }else if(this.state.formData.cardNumber == "" && this.state.formData.confCardNumber != "") {
		// 	this.refs.cardNumberRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardNumberRef.focus();
		// 	this.refs.confCardNumberRef.value = '';
		// 	this.setState({checkSubForm:1,checkSubFormMsg:"Please enter Card Holder Name first!"});
		// 	return false;
		// }else if(this.state.formData.cardNumber != "" && (this.state.formData.cardNumber != this.state.formData.confCardNumber)){
		// 	this.refs.cardNumberRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardNumberRef.focus();
		// 	this.refs.confCardNumberRef.value = '';
		// 	this.setState({errorCd:1,errMsg:"Please confirm Card Number!"});
		// 	return false;
		// }else{
		// 	this.refs.cardNumberRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		// if(this.state.formData.cardType == ""){
		// 	this.refs.cardTypeRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardTypeRef.focus();
		// 	this.setState({errorCd:1,errMsg:"Please select Card Type!"});
		// 	return false;
		// }else{
		// 	this.refs.cardTypeRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		// if(this.state.formData.cardBankName == ""){
		// 	this.refs.cardBankNameRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardBankNameRef.focus();
		// 	this.setState({errorCd:1,errMsg:"Please enter Bank Name!"});
		// 	return false;
		// }else{
		// 	this.refs.cardBankNameRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		// if(this.state.formData.expMonth == ""){
		// 	this.refs.cardExpMonthRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardExpMonthRef.focus();
		// 	this.setState({errorCd:1,errMsg:"Please select Card Expiry Month!"});
		// 	return false;
		// }else{
		// 	this.refs.cardExpMonthRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		// if(this.state.formData.expYear == ""){
		// 	this.refs.cardExpYearRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.cardExpYearRef.focus();
		// 	this.setState({errorCd:1,errMsg:"Please select Card Expiry Year!"});
		// 	return false;
		// }else{
		// 	this.refs.cardExpYearRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		/*if(this.state.focusAccordion == 0){
			this.focusAccordionDisp('#sidtls');
			this.setState({focusAccordion:1})
		}*/
		if (this.state.formData.siStartDate == "") {
			this.refs.siStartDateRef.style["border-bottom"] = "1px solid #c73939";
			this.accordionDisp_save("si_accnt");
			this.refs.siStartDateRef.focus();
			this.setState({ errorCd: 1, errMsg: "Please select SI Details Start Date!" });
			return false;
		} else {
			this.refs.siStartDateRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
		}
		if (this.state.formData.siDebitDate == "") {
			this.refs.siDebitDateRef.style["border-bottom"] = "1px solid #c73939";
			this.accordionDisp_save("si_accnt");
			this.refs.siDebitDateRef.focus();
			this.setState({ errorCd: 1, errMsg: "Please select Debit Date!" });
			return false;
		} else {
			this.refs.siDebitDateRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
		}
		// if (new Date(this.state.formData.siStartDate) > new Date(this.state.formData.siEndDate)) {
		// 	this.refs.siStartDateRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.accordionDisp_save('si_accnt');
		// 	this.refs.siStartDateRef.focus();
		// 	this.setState({ errorCd: 1, errMsg: "Please select Expiry Month and Expiry Year greater than SI Details Start Date !" });
		// 	return false;
		// } else {
		// 	this.refs.siStartDateRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3

		// }
		// if (this.state.formData.siDebFrequency == "") {
		// 	this.accordionDisp_save('si_accnt');
		// 	this.setState({ errorCd: 1, errMsg: "Please select Debit Frequency!" });
		// 	return false;
		// }
		// if (this.state.formData.ecsAmount == "") {
		// 	this.refs.maxBillingEcsAmountRef.style['border-bottom'] = '1px solid #c73939';
		// 	this.accordionDisp_save('si_accnt');
		// 	this.refs.maxBillingEcsAmountRef.focus();
		// 	this.setState({ errorCd: 1, errMsg: "Please Enter Max. Billing Amt!" });
		// 	return false;
		// } else {
		// 	this.refs.maxBillingEcsAmountRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		if (!this.state.formData.ecsAmount || parseFloat(this.state.formData.ecsAmount) < this.state.formData.minEcsAmt) {
			this.refs.maxBillingEcsAmountRef.style["border-bottom"] = "1px solid #c73939";
			this.accordionDisp_save("si_accnt");
			this.refs.maxBillingEcsAmountRef.focus();
			this.setState({ errMsg: "Please enter Monthly Billing Amount greater than " + parseFloat(this.state.formData.minEcsAmt) + " !", errorCd: 1 });
			return false;
		} else {
			this.refs.maxBillingEcsAmountRef.style["border-bottom"] = "1px solid #ddd"; //#EDF2F3
		}
		// if (this.state.formData.ecsMaxAmount != "" && (parseFloat(this.state.formData.ecsMaxAmount) < parseFloat(this.state.formData.minEcsAmt))) {
		// 	this.refs.ecsMaxAmount_si.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.ecsMaxAmount_si.focus();
		// 	this.refs.ecsMaxAmount_si.value = '';
		// 	this.setState({ errorCd: 1, errMsg: "Please enter  Maximum Billing Amount which is greater than " + parseFloat(this.state.formData.minEcsAmt) }, () => {
		// 		setTimeout(() => {
		// 			this.setState({ errMsg: '', errorCd: 0 });
		// 		}, 10000);
		// 	});
		// 	return false;
		// }
		// else{
		// 	this.refs.cardNumberRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		// if (this.state.formData.ecsMaxAmount != "" && (parseFloat(this.state.formData.ecsMaxAmount) != parseFloat(this.state.formData.ecsMaxAmount_conf))) {
		// 	this.refs.ecsMaxAmount_si.style['border-bottom'] = '1px solid #c73939';
		// 	this.refs.ecsMaxAmount_si.focus();
		// 	this.refs.ecsMaxAmount_si.value = '';
		// 	this.setState({ errorCd: 1, errMsg: "Confirmation Maximum Billing Amount does not match Maximum Billing Amount!" }, () => {
		// 		setTimeout(() => {
		// 			this.setState({ errMsg: '', errorCd: 0 });
		// 		}, 10000);
		// 	});
		// 	return false;
		// }
		// else{
		// 	this.refs.cardNumberRef.style['border-bottom'] = '1px solid #ddd';//#EDF2F3
		// }
		this.setState({ showLoader: 1 });
		AllocationActions.submitSiMandate(this.props.params.parentid, this.state.formData, this.state.empData, "submitSiMandate");
	}

	submitEMandate() {
		var thisObj = this;
		if (typeof this.state.e_mandate_data !== "undefined" && (this.state.e_mandate_data.mp_portal < 0 || this.state.e_mandate_data.mp_portal == null)) {
			thisObj.setState({ errorCd: 1, isWarning: 1, alert_msg: "Please select an option before proceeding further", handleEnach: 0 });
			return false;
		}
		if (this.state.e_mandate_data.mp_portal == 0) {
			var data = thisObj.ValidateEmail(this.state.e_mandate_data.email_id);
			if (data.errorCd == 1 && this.state.e_mandate_data.email_id != "") {
				thisObj.setState({ errorCd: 1, isWarning: 1, alert_msg: "Please enter a valid Email Address!", handleEnach: 0 });
				thisObj.refs.email_id.style["border-bottom"] = "1px solid #c73939";
				thisObj.refs.email_id.focus();
				return false;
			} else {
				thisObj.refs.email_id.style["border-bottom"] = "1px solid #ddd";
				thisObj.setState({ errorCd: 0 });

				if (!helperFunc.validateMobile(this.state.e_mandate_data.mobile_number)) {
					thisObj.setState({ isWarning: 1, alert_msg: "Please enter a valid mobile number", handleEnach: 0 });
					thisObj.refs.mobile_number.style["border-bottom"] = "1px solid #c73939";
					thisObj.refs.mobile_number.focus();
					return false;
				} else {
					thisObj.refs.mobile_number.style["border-bottom"] = "1px solid #ddd";
					thisObj.setState({ errorCd: 0 });
				}
			}
		}

		if (this.state.errorCd == 0) {
			//this.savePayment(this.state.currentTab);
			var thisObj = this;
			this.setState({ errMsg: "Success", errorCd: 0, showLoader: 1, netbankfact_modal: false }, function() {
				if (this.state.e_mandate_data.mp_portal == 0) {
					let objData = {};
					objData = this.state.e_mandate_data;
					objData["mandateDataExist"] = this.state.mandateDataExist;
					objData["user_pay_mode"] = this.state.formData.user_pay_mode;
					objData["is_physical_mandate"] = localStorage.getItem("physicalMandate") == "true" ? 1 : 0;
					// AllocationActions.digital_mandate_link(objData);
					if (!this.checkPhysicalMandate()) {
						AllocationActions.digital_mandate_link(objData);
					} else {
						this.showPhysicalMandate();
					}
				} else if (this.state.e_mandate_data.mp_portal == 1) {
					setTimeout(() => {
						$("#innerdiv").load("../genio_services/genio/digital_mandate?e_data=" + window.encodeURIComponent(JSON.stringify(this.state.e_mandate_data)), (response, status, xhr) => {
							this.setState({ showLoader: 0 });
							var load_response = JSON.parse(response);
							if (load_response["ERRCODE"] == 2) {
								this.setState({ showLoader: 0, alert_msg: load_response["MESSAGE"], isWarning: 1, innerDiv: false });
							}
						});
					}, 2000);
				} else if (this.state.e_mandate_data.mp_portal == 2) {
					this.handleDigitalMandatePopup(0);
				}
			});
		}
	}

	savePayment(currentTab, forceSave = false) {
		if (this.state.validateACNO == 1) {
			this.verifyACNODetails(currentTab);
		}
		if (this.state.validateACNO == 0) {
			console.log("===>>>", this.state.validateACNO);
			this.setState({ validateACNO: 1 });
			if (currentTab == "ecsmandate") {
				if (this.state.e_mandate_data.mp_portal == 0 && this.state.handleEnach == 1 && this.state.netbankfactConfirm_modal == true) {
					// console.log('11111');
					this.submitEMandate();
					return false;
				}
				// if((this.state.handleEnach == 1 && this.state.netbankfactConfirm_modal == true) && typeof this.state.e_mandate_data !== "undefined" && (this.state.e_mandate_data.mp_portal < 0 || this.state.e_mandate_data.mp_portal ==null)){

				// 	this.setState({ errorCd: 1, isWarning: 1, alert_msg: 'Please select an option before proceeding further' });
				// 	return false
				// }

				if (this.savePayment_ecs(currentTab, this.state.currentSection)) {
					this.setState({ errMsg: "Success", errorCd: 0, showLoader: 1 }, function() {
						if (this.state.handleEnach == 0) {
							var objData = {};
							objData = helperFunc.assign(this.state.formData);
							objData["skip_val"] = 1;
							objData["nach_image_show"] = 2;
							objData["nach_image_preview"] = "";
							objData["is_physical_mandate"] = localStorage.getItem("physicalMandate") == "true" ? 1 : 0;
							objData["bankName"] = localStorage.getItem("enachBankName") || objData["bankName"];
							objData["consumer_code"] = this.state.consumer_code;

							if(this.props.empdata.department && this.props.empdata.department.toLowerCase() == 'sales - jd mart') {
								objData["untilCancelFlag"] = 1;
							}

							AllocationActionsLite.verifyEcsMandate(this.props.params.parentid, objData, this.state.empData, "verifyEcsMandate");
						} else {
							var objData = {};
							objData = helperFunc.assign(this.state.formData);
							objData["bankName"] = localStorage.getItem("enachBankName") || objData["bankName"];
							objData["skip_val"] = 0;
							objData["is_physical_mandate"] = localStorage.getItem("physicalMandate") == "true" ? 1 : 0;
							objData["consumer_code"] = this.state.consumer_code;

							if (localStorage.getItem("campaign_id") == "96") {
								objData["pay_pc"] = 1;
							}
							//console.log("this.state.iciciMandate", this.state.iciciMandate);
							// if(this.state.iciciMandate == 1 && ['10083404', '10015427', '10015416', '10029347'].includes(EMPCODE)){
							if (this.state.iciciMandate == 1) {
								objData["icici_mobile_number"] = this.state.e_mandate_data.mobile_number;
								objData["icici_email_id"] = this.state.e_mandate_data.email_id;
								objData["icici_dob"] = this.state.e_mandate_data.dob;
								objData["iciciMandate"] = 1;

								objData["enach"] = 1;
								objData["skip_val"] = 1;
								objData["nach_image_show"] = 2;

								if (!objData["icici_email_id"] || !objData["icici_mobile_number"] || !objData["icici_dob"]) {
									this.setState({ errorCd: 1, isWarning: 1, alert_msg: "Please fill all information before proceeding further", showLoader: 0 });
									return false;
								}
								var data = this.ValidateEmail(objData["icici_email_id"]);
								if (data.errorCd == 1) {
									this.setState({ errorCd: 1, isWarning: 1, alert_msg: "Please enter valid email address", showLoader: 0 });
									return false;
								}
								let pattern_mob = /(6|7|8|9)\d{9}$/;
								if (objData["icici_mobile_number"].length != 10 || !pattern_mob.test(objData["icici_mobile_number"])) {
									this.setState({ errorCd: 1, isWarning: 1, alert_msg: "Please enter valid mobile no", showLoader: 0 });
									return false;
								}
							}

							// AllocationActions.submitEcsMandate(this.props.params.parentid, objData, this.state.empData, this.state.filePath);

							if (!this.checkPhysicalMandate()) {
								const showConsumerCode = localStorage.getItem("showConsumerCode");
								if (showConsumerCode == 1) {
									objData["consumer_code"] = this.state.consumer_code;
								}
								console.log("bac************************", showConsumerCode, this.state.consumer_code);

								if (showConsumerCode == 1 && this.state.consumer_code == "") {
									this.setState({ errorCd: 1, isWarning: 1, alert_msg: "Consumer code is empty please reload and try again.", showLoader: 0 });

									return;
								}

								if(this.props.empdata.department && this.props.empdata.department.toLowerCase() == 'sales - jd mart') {
									objData["untilCancelFlag"] = 1;
								}

								AllocationActions.submitEcsMandate(this.props.params.parentid, objData, this.state.empData, this.state.filePath);
							} else {
								this.showPhysicalMandate();
							}
						}
					});
				}
			} else if (currentTab == "simandate") {
				this.savePayment_si(currentTab);
			}
		}
	}
	/*Auto-Suggest Functionality*/

	getSuggestions(value, fieldName) {
		if (fieldName === "bankName" || fieldName === "bankCity") {
			AllocationActionsLite.fetchBankAutoSuggest_mandate(this.state.formData, this.state.actionType, value);
		} else {
			AllocationActions.fetchBankAutoSuggest(this.state.formData, this.state.actionType, value);
		}
	}

	getSuggestionValue(suggestion) {
		return suggestion;
	}
	renderSuggestion(suggestion) {
		return <div>{suggestion}</div>;
	}

	onSuggestionsFetchRequested({ value, reason, fieldName = "" }) {
		if (reason == "input-focused") {
			return;
		}
		this.setState({ autoLoader: 1 });
		this.getSuggestions(value, fieldName);
	}
	onSuggestionsClearRequested() {
		this.setState({
			suggestions: [],
		});
	}
	onSuggestionSelected(type, suggestion) {
		switch (type) {
			case "bankcity":
				var newVals = {};
				newVals = helperFunc.assign(this.state.formData);
				newVals["bankcity"] = suggestion;
				this.setState({ formData: newVals, disableBankName: false, errMsg: "", errorCd: "" });
				break;
			case "bankName":
				var newVals = {};
				newVals = helperFunc.assign(this.state.formData);
				newVals["bankName"] = suggestion;
				this.setState({ formData: newVals, disableBankBranch: false, errMsg: "", errorCd: "" });
				break;
				break;
			case "bankBranch":
				this.getBankDetails(2, "receiveBankMicr");
				var newVals = {};
				newVals = helperFunc.assign(this.state.formData);
				newVals["bankBranch"] = suggestion;
				this.setState({ formData: newVals, errMsg: "", errorCd: "" });
				break;
				/*setTimeout(function() {
					helperFunc.handleInputBlurLoad();
				},350);*/
				break;
			case "cardBankName":
				var newVals = {};
				newVals = helperFunc.assign(this.state.formData);
				newVals["cardBankName"] = suggestion;
				this.setState({ formData: newVals, errMsg: "", errorCd: "" });
				break;
				break;
		}
		setTimeout(function() {
			helperFunc.handleInputBlurLoad();
		}, 350);
	}
	onAutoChange(event, { newValue }) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.formData);
		newVals["bankcity"] = newValue;
		this.setState({ formData: newVals });
	}
	checkAutoVal(e) {
		helperFunc.handleInputBlur(e);
	}

	setApiData(inputType) {
		/* Used to set API Action used in get_bank_det & get_bank_AutoSuggest*/
		this.setState({ actionType: inputType });
	}
	setApiData_si(inputType, flag) {
		var newVals = {};
		newVals = helperFunc.assign(this.state.formData);
		newVals["is_si"] = flag;
		this.setState({ actionType: inputType, formData: newVals });
	}
	inputPropsAuto(type, placeHolder, value, proptype, isDisabled) {
		if (type == "bankBranch" && localStorage.getItem("physicalMandate") == "false") {
			isDisabled = false;
		}
		var obj = this;
		var retData = {
			id: type,
			placeholder: placeHolder,
			value: value,
			onChange: function(event, { newValue }) {
				if (proptype == "bankcity") {
					var newVals = {};
					newVals = helperFunc.assign(obj.state);
					//newVals['formData']['bankcity']		=	'';
					// newVals['formData']['bankName'] = '';
					newVals["formData"]["bankBranch"] = "";
					newVals["formData"]["bankIfsc"] = "";
					newVals["formData"]["micr"] = "";
					newVals["formData"]["bankAdd"] = "";
					obj.setState({ newVals });
				}
				if (proptype == "bankName") {
					var newVals = {};
					newVals = helperFunc.assign(obj.state);
					newVals["formData"]["bankcity"] = "";
					newVals["formData"]["bankName"] = newValue;
					newVals["formData"]["bankBranch"] = "";
					newVals["formData"]["bankIfsc"] = "";
					newVals["formData"]["micr"] = "";
					newVals["formData"]["bankAdd"] = "";
					obj.setState({ newVals });
				} else if (proptype == "cardBankName") {
					var newVals = {};
					newVals = helperFunc.assign(obj.state);
					newVals["formData"]["cardBankName"] = newValue;
					obj.setState({ newVals });
				} else if (newValue == "" && proptype == "bankBranch") {
					var newVals = {};
					newVals = helperFunc.assign(obj.state);
					//newVals['formData']['bankcity']		=	'';
					//newVals['formData']['bankName']		=	'';
					newVals["formData"]["bankBranch"] = "";
					newVals["formData"]["bankIfsc"] = "";
					newVals["formData"]["micr"] = "";
					newVals["formData"]["bankAdd"] = "";
					obj.setState({ newVals });
				} else if (newValue == "") {
					var newVals = {};
					newVals = helperFunc.assign(obj.state);
					newVals["formData"]["bankcity"] = "";
					newVals["formData"]["bankName"] = "";
					newVals["formData"]["bankBranch"] = "";
					newVals["formData"]["bankIfsc"] = "";
					newVals["formData"]["micr"] = "";
					newVals["formData"]["bankAdd"] = "";
					obj.setState({ newVals });
				} else {
					var newVals = {};
					newVals = helperFunc.assign(obj.state);
					newVals["formData"][proptype] = newValue;
					obj.setState({ newVals });
				}
			},
			onBlur: function(event) {
				helperFunc.handleInputBlur(event);
			},
			onFocus: function(event) {
				helperFunc.handleInputFocus(event);
				event.preventDefault();
				return false;
			},
			disabled: isDisabled,
		};
		return retData;
	}
	handleDigitalMandatePopup(response) {
		if (response == 1) {
			var newVals = {};
			newVals = helperFunc.assign(this.state.e_mandate_data);
			newVals["mp_portal"] = 0;
			// newVals['emandate_close_url']	=	window.encodeURIComponent(paths.GENIO_LITE+"make-payment/"+this.props.params.parentid+"/"+this.props.params.master_transaction_id);
			// newVals['eredirect_url']	=	window.encodeURIComponent(paths.GENIO_LITE+"make-payment/"+this.props.params.parentid+"/"+this.props.params.master_transaction_id);
			if (type == 1) {
				newVals["emandate_close_url"] = window.encodeURIComponent(paths.GENIO_LITE + "payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
				newVals["eredirect_url"] = window.encodeURIComponent(paths.GENIO_LITE + "payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
			}
			this.setState({ e_mandate_data: newVals, netbankfactConfirm_modal: true }, () => {
				// console.log(this.state);
			});
		} else {
		}
	}
	closeModal() {
		this.setState({ showModal: 0, netbankfact_modal: false, netbankfactConfirm_modal: false, warning_type: "danger" });
	}
	closeAlert() {
		this.setState({ errorCd: 0, warning_type: "danger" });
	}
	loadAlert_client() {
		setTimeout(() => {
			this.setState({ errorCd: 0 });
		}, 5000);
		return true;
	}
	loadAlert_server() {
		setTimeout(() => {
			this.setState({ errorArrCd: 0 });
		}, 5000);
		return true;
	}
	onDrop(files, image_type) {
		//console.log(image_type);
		let nach_image_remove = this.state.nach_image_remove;
		let ecs_image_remove = this.state.ecs_image_remove;
		let cheque_image_remove = this.state.cheque_image_remove;
		let thisObj = this;
		for (var keyImg in files) {
			if (files[keyImg]["type"] != "image/jpeg" && files[keyImg]["type"] != "image/jpg" && files[keyImg]["type"] != "image/png") {
				this.setState({ alert_msg: "Unsupported File Type", isWarning: 1, warning_action: "danger" });
				return false;
			}
			if (files.hasOwnProperty(keyImg) && files[keyImg] instanceof File) {
				let file = files[keyImg];
				let reader = new FileReader();
				reader.onload = function(e) {
					var newVals = {};
					newVals = helperFunc.assign(thisObj.state);

					if (image_type == "nach_image") {
						newVals["formData"]["nach_image_preview"] = e.target.result;
					}
					if (image_type == "ecs_image") {
						newVals["formData"]["ecs_image_preview"] = e.target.result;
					}
					if (image_type == "cheque_image") {
						newVals["formData"]["cheque_image_preview"] = e.target.result;
					}
					thisObj.setState({ newVals });
				};
				reader.readAsDataURL(file);

				var newVals = {};
				newVals = helperFunc.assign(thisObj.state);

				const compress = new Compress();
				const fileData = [file];
				compress
					.compress(fileData, {
						size: 4, // the max size in MB, defaults to 2MB
						quality: 0.5, // the quality of the image, max is 1,
						maxWidth: 1920, // the max width of the output image, defaults to 1920px
						maxHeight: 1920, // the max height of the output image, defaults to 1920px
						resize: true, // defaults to true, set false if you do not want to resize the image width and height
					})
					.then((data) => {
						// returns an array of compressed images
						const img1 = data[0];
						const base64str = img1.data;
						const imgExt = img1.ext;
						const fileValue = Compress.convertBase64ToFile(base64str, imgExt);

						if (image_type == "nach_image") {
							newVals["formData"]["nach_image_file_path"] = fileValue;
							newVals["formData"]["nach_image_image_type"] = imgExt;
							newVals["formData"]["nach_image_image_name"] = img1.alt;
							newVals["formData"]["nach_image_show"] = fileValue;
							nach_image_remove = 1;
						}

						if (image_type == "ecs_image") {
							newVals["formData"]["ecs_image_file_path"] = fileValue;
							newVals["formData"]["ecs_image_image_type"] = imgExt;
							newVals["formData"]["ecs_image_image_name"] = img1.alt;
							ecs_image_remove = 1;
						}

						if (image_type == "cheque_image") {
							newVals["formData"]["cheque_image_file_path"] = fileValue;
							newVals["formData"]["cheque_image_image_type"] = imgExt;
							newVals["formData"]["cheque_image_image_name"] = img1.alt;
							cheque_image_remove = 1;
						}

						thisObj.setState({ newVals, nach_image_remove, ecs_image_remove, cheque_image_remove });
					});
			}
		}
	}
	handleModal(param) {
		switch (param) {
			case "proceed":
				this.setState({ showModal: 0, modalTitle: "", modalMsg: "" });
				// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
				hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
				break;
			case "handleEnach":
				this.setState({ showModal: 0, modalTitle: "", modalMsg: "", handleEnach: 1, hideShowEnach: 0 });
				break;
			case "hideShowEnach":
				this.setState({ hideShowEnach: this.state.hideShowEnach == 1 ? 0 : 1 });
				break;
		}
	}
	skipMandate() {
		var objData = {};
		objData["parentid"] = this.props.params.parentid;
		objData["master_transaction_id"] = this.props.params.master_transaction_id;
		objData["payment_type"] = "ecs";
		objData["mecode"] = EMPCODE;
		objData["mandate_params"] = "";
		objData["enach"] = "";
		objData["consumerid"] = "";
		objData["skip_mandate"] = 1;
		this.setState({ showLoader: 1 });
		AllocationActionsLite.skipMandate(objData, "skipMandate");
	}
	cardValidator(param, param1, param2, param3) {
		if (this.state.currentTab == "ecsmandate") {
			this.savePayment(this.state.currentTab);
			return false;
		}
		switch (param) {
			case "verifyCard":
				let siMandateObj = {};
				siMandateObj["siDebitDate"] = this.state.formData.siDebitDate;
				siMandateObj["tempSiStart"] = this.state.tempSiStart;
				localStorage.setItem("siMandateObj", JSON.stringify(siMandateObj));
				hashHistory.push("card-validator/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/verifyCard");
				return false;
				break;
			case "validateCard":
				this.savePayment(this.state.currentTab);
				return false; // Taiga #5627

				let jdpay_data = this.state.jdPayObj,
					cardValidated = 0;
				// console.log(this.state.jdPayObj);
				Object.keys(jdpay_data).map(function(key, val) {
					if (jdpay_data[key]["isActive"] == 1 && parseInt(jdpay_data[key]["amount"]) == 1) {
						cardValidated = 1;
					}
				});
				if (
					this.state.formData.auto_payment_id != "" &&
					this.state.formData.auto_payment_id != null &&
					this.state.formData.auto_payment_id != undefined &&
					this.state.formData.mobile_num != "" &&
					this.state.formData.mobile_num != null &&
					this.state.formData.mobile_num != undefined &&
					this.state.formData.is_zion != "" &&
					this.state.formData.is_zion != null &&
					this.state.formData.is_zion != undefined
				) {
					this.savePayment(this.state.currentTab);
					return false;
				}
				if (cardValidated == 1) {
					this.savePayment(this.state.currentTab);
					return false;
				} else {
					let cardObj = {};
					cardObj["parentid"] = this.props.params.parentid;
					cardObj["master_transaction_id"] = this.props.params.master_transaction_id;
					cardObj["mandate_type"] = "si";
					AllocationActionsLite.verifyMandateCard(cardObj, "verifyMandateCardCcsi");
					this.setState({ showLoader: 1 });
				}
				break;
			case "confirmDeleteJdpay":
				this.setState({ showModal: 3, delete_pg_trans_id: param1, delete_instrument_type: param2, shortcode: param3 });
				break;
			case "deleteJdpay":
				this.setState({ showModal: 0, showLoader: 1 });
				AllocationActions.deActivateInstrumentJDPay(this.props.params.parentid, this.props.params.master_transaction_id, this.state.delete_pg_trans_id, this.state.delete_instrument_type, this.state.shortcode, EMPCODE);
				break;
		}
	}
	validateBankDetails() {
		// this.savePayment(this.state.currentTab, this.state.currentSection);
		let flag = this.savePayment_ecs(this.state.currentTab, this.state.currentSection);
		if (flag !== false) {
			this.setState({ errMsg: "Success", errorCd: 0, showLoader: 1 }, function() {
				var objData = {};
				objData = helperFunc.assign(this.state.formData);
				objData["skip_val"] = 1;
				objData["nach_image_show"] = 2;
				objData["nach_image_preview"] = "";
				// AllocationActionsLite.verifyEcsMandate(this.props.params.parentid, objData, this.state.empData,"verifyEcsMandate_bankDetails");
				AllocationActionsLite.checkEnachEligible_bankSelected("bankName" in this.state.formData ? this.state.formData.bankName : "", "verifyEcsMandate_bankDetails");
			});
			helperFunc.handleInputBlurLoad();
			// this.setState({
			// 	currentSection: 'accountAndEmiDetails'
			// });
		}
	}

	maskMobileNumber(value) {
		let first4 = value.substring(0, 4);
		let last3 = value.substring(value.length - 3);

		mask = value.substring(4, value.length - 3).replace(/\d/g, "*");
		return first4 + mask + last3;
	}

	checkPhysicalMandate() {
		if (
			this.state.handleEnach == 1 &&
			this.state.empData.manage_campaign == 0 &&
			this.state.hideShowEnach == 0 &&
			((this.state.e_mandate_data.mp_portal == "2" && this.state.netbankfactConfirm_modal == true) || this.state.netbankfactConfirm_modal == false) &&
			!(this.state.currentSection === "physicalMandate")
		) {
			return true;
		}
		return false;
	}

	showPhysicalMandate() {
		this.resetLoader();
		this.setState({
			currentSection: "physicalMandate",
		});
	}

	resetLoader() {
		this.setState({
			showLoader: 0,
			setLoader: 0,
		});
	}

	maskPhoneNumber(string) {
		try {
			let first4 = string.substring(0, 4);
			let last3 = string.substring(string.length - 3);
			let mask = string.substring(4, string.length - 3).replace(/\d/g, "*");
			return first4 + mask + last3;
		} catch {
			return string;
		}
	}

	checkEcsEligible() {
		if (this.state.enachEligible === 1) {
			return true;
		}
		return false;
	}

	resetImage(image_type) {
		// console.log("this.state.mandate_nach_preview",this.state.mandate_nach_preview)
		console.log("this.state.mandate_ecs_preview", this.state.mandate_ecs_preview);
		let ecs_image_remove = this.state.ecs_image_remove;
		let nach_image_remove = this.state.nach_image_remove;
		let cheque_image_remove = this.state.cheque_image_remove;
		let mandate_nach_preview = this.state.mandate_nach_preview;
		let mandate_ecs_preview = this.state.mandate_ecs_preview;
		let mandate_cheque_preview = this.state.mandate_cheque_preview;
		let newVals = helperFunc.assign(this.state);
		switch (image_type) {
			case "nach_image":
				newVals["formData"]["nach_image_preview"] = "";
				delete newVals["formData"]["nach_image_file_path"];
				delete newVals["formData"]["nach_image_image_type"];
				delete newVals["formData"]["nach_image_image_name"];
				nach_image_remove = 0;

				// newVals['formData']['nach_image_show'] = 0;
				// nach_image_remove = 0;
				// if (mandate_nach_preview) {
				// 	newVals['formData']['nach_image_show'] = 1;

				// }
				break;

			case "ecs_image":
				newVals["formData"]["ecs_image_preview"] = "";
				delete newVals["formData"]["ecs_image_file_path"];
				delete newVals["formData"]["ecs_image_image_type"];
				delete newVals["formData"]["ecs_image_image_name"];
				ecs_image_remove = 0;
				break;

			case "cheque_image":
				newVals["formData"]["cheque_image_preview"] = "";
				delete newVals["formData"]["cheque_image_file_path"];
				delete newVals["formData"]["cheque_image_image_type"];
				delete newVals["formData"]["cheque_image_image_name"];
				cheque_image_remove = 0;
				break;
		}

		this.setState({ newVals, nach_image_remove, ecs_image_remove, cheque_image_remove }, () => {
			console.log("newVals---", newVals);
		});
	}
	helpFunction() {
		this.setState({ popUp: 1, hide: 1 });
	}
	closePopUp() {
		this.setState({ popUp: 0, hide: 0 });
	}
	redirect(num) {
		setTimeout(() => {
			if (isMobile) {
				setTimeout(() => {
					if (ios) {
						window.location.href = "https://sales.genio.in/sales_genio/wa.php?OPEN_OUTSIDE_APP=1&params=" + window.encodeURIComponent(JSON.stringify({ whatsapp: "91" + this.state.mobileData[num], msg: "Hi" }));
					} else {
						window.ReactNativeWebView.postMessage(JSON.stringify({ whatsapp: "91" + this.state.mobileData[num], msg: window.encodeURIComponent("Hi") }));
					}
				}, 200);
			} else {
				window.open("https://web.whatsapp.com/send?phone=91" + this.state.mobileData[num] + "&text=" + window.encodeURIComponent("Hi"), "_blank");
			}
		}, 100);
	}
	render() {
		let tmeFlag = localStorage.getItem("bypass");
		const {
			suggestions,
			disableBankName,
			hideShowEnach,
			disableBankBranch,
			placeholder,
			actionType,
			autoLoader,
			modalMsg,
			modalTitle,
			showModal,
			tabType,
			handleEnach,
			mandate,
			currentSection,
			ecs_image_remove,
			nach_image_remove,
			cheque_image_remove,
		} = this.state;
		const {
			bankcity,
			bankName,
			bankBranch,
			minEcsAmt,
			nach_image_preview,
			nach_image_show,
			outletCheck,
			ecs_image_preview,
			ecs_image_show,
			nach_image_file_path,
			ecs_image_file_path,
			cheque_image_preview,
			cheque_image_show,
			cheque_image_file_path,
		} = this.state.formData;

		var thisObj = this;
		// console.log('this.state - ', this.state);
		const showConsumerCode = localStorage.getItem("showConsumerCode");

		if (EMPCODE == "10015427" || EMPCODE == "10029347" || EMPCODE == "10100044" || EMPCODE == "10083404") {
			console.log("state------------", this.state);
		}

		if (currentSection === "tokenTransactionLinkDetails" && "bankName" in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(" ").indexOf("IC123ICI") > -1) {
			$("#headerName").text("Direct Debit Verification Link");
		}

		return (
			<div>
				{mandate == "true" && (
					<div>
						{currentSection === "bankDetails" && (
							<section className="pull-left col-xs-12 p0 midsec">
								<div className="container mid-otr">
									<div className="col-xs-12 dwhtbg">
										<div className="col-xs-12 col-sm-6 col-sm-offset-3 p0 mt10">
											<div className="col-xs-12 p0 grytxt2 mb20">
												<span className="weight600">Note:</span> Mandate account and cheque account must match in case of down payment by cheque
											</div>

											{/* consumer code input*/}

											{showConsumerCode == 1 && (
												<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
													{/* <input type="text" className="form-control" /> */}
													<input type="text" className={"form-control anmtlbl"} disabled="disabled" value={this.state.consumer_code} />
													<label>Consumer Code</label>
												</div>
											)}

											<div ref="bankNameSel" className="col-xs-12 form-group p0 mt10 inrfrm lblanmt" onFocus={this.setApiData.bind(this, 4)}>
												{/* <input type="text" className="form-control" /> */}

												<Autosuggest
													id="autosggstId2"
													suggestions={suggestions}
													onSuggestionsFetchRequested={({ value, reason }) => {
														this.onSuggestionsFetchRequested({ value, reason, fieldName: "bankName" });
													}}
													onSuggestionsClearRequested={this.onSuggestionsClearRequested}
													getSuggestionValue={this.getSuggestionValue}
													renderSuggestion={this.renderSuggestion}
													// inputProps={this.inputPropsAuto('bankName', '', bankName, 'bankName', disableBankName, thisObj.checkAutoVal)}
													inputProps={this.inputPropsAuto("bankName", "", bankName, "bankName", false, thisObj.checkAutoVal)}
													onSuggestionSelected={function(e, { suggestion }) {
														thisObj.onSuggestionSelected("bankName", suggestion);
													}}
												/>
												<label>Bank Name</label>
												{autoLoader == 1 && actionType == 4 && (
													<svg className="autoCircular" viewBox="25 25 50 50">
														{" "}
														<circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
													</svg>
												)}
											</div>

											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input
													ref="bankMicrSel"
													type="text"
													className={this.state.formData.micr != "" ? "form-control anmtlbl" : "form-control"}
													value={this.state.formData.micr}
													onChange={(e) => this.formUpdater(e, "micr")}
													onBlur={() => this.getBankDetails(1, "receiveBankInfo")}
												/>
												<label>MICR Code</label>
											</div>

											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt" ref="bankCity" onFocus={this.setApiData.bind(this, 3)}>
												{/* <input type="text" className="form-control" /> */}
												<Autosuggest
													id="autosggstId1"
													suggestions={suggestions}
													// onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
													onSuggestionsFetchRequested={({ value, reason }) => {
														this.onSuggestionsFetchRequested({ value, reason, fieldName: "bankCity" });
													}}
													onSuggestionsClearRequested={this.onSuggestionsClearRequested}
													getSuggestionValue={this.getSuggestionValue}
													renderSuggestion={this.renderSuggestion}
													inputProps={this.inputPropsAuto("bankcity", "", bankcity, "bankcity", false, thisObj.checkAutoVal)}
													onSuggestionSelected={function(e, { suggestion }) {
														thisObj.onSuggestionSelected("bankcity", suggestion);
													}}
												/>
												<label>Bank City</label>
												{autoLoader == 1 && actionType == 3 && (
													<svg className="autoCircular" viewBox="25 25 50 50">
														{" "}
														<circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
													</svg>
												)}
											</div>

											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt" ref="bankBranchName" onFocus={this.setApiData.bind(this, 5)}>
												{/* <input type="text" className="form-control" /> */}
												<Autosuggest
													suggestions={suggestions}
													onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
													onSuggestionsClearRequested={this.onSuggestionsClearRequested}
													getSuggestionValue={this.getSuggestionValue}
													renderSuggestion={this.renderSuggestion}
													inputProps={this.inputPropsAuto("bankBranch", "", bankBranch, "bankBranch", disableBankBranch, thisObj.checkAutoVal)}
													onSuggestionSelected={function(e, { suggestion }) {
														thisObj.onSuggestionSelected("bankBranch", suggestion);
													}}
												/>
												<label>Bank Branch</label>
												{autoLoader == 1 && actionType == 5 && (
													<svg className="autoCircular" viewBox="25 25 50 50">
														{" "}
														<circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
													</svg>
												)}
											</div>
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input type="text" className={this.state.formData.bankAdd != "" ? "form-control anmtlbl" : "form-control"} value={this.state.formData.bankAdd} onChange={(e) => this.formUpdater(e, "bankAdd")} />
												<label>Bank Address</label>
											</div>
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												<input
													ref="bankIfscCodeSel"
													type="text"
													className={this.state.formData.bankIfsc != "" ? "form-control anmtlbl" : "form-control"}
													value={this.state.formData.bankIfsc}
													onChange={(e) => this.formUpdater(e, "bankIfsc")}
													onFocus={() => helperFunc.handleInputFocus(event)}
													onBlur={() => helperFunc.handleInputBlur(event)}
												/>
												<label>IFSC Code</label>
											</div>
											{/* <div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input ref="bankIfscCodeSel" type="text" className={(this.state.formData.bankIfsc != '') ? "form-control anmtlbl" : "form-control"} value={this.state.formData.bankIfsc} onChange={(e) => this.formUpdater(e, 'bankIfsc')} onFocus={() => helperFunc.handleInputFocus(event)} onBlur={() => helperFunc.handleInputBlur(event)} />
									<label>IFSC Code</label>
								</div> */}

											{this.state.jdUserFlg == 0 && (
												<div className="col-xs-12 p0 mt10 mb10 duplichkbox">
													<label>
														<input type="checkbox" name="dplichkbox" onChange={(e) => this.formUpdater(e, "outletCheck")} checked={outletCheck == 1} />
														<i className="beforecheckicn"></i>
														<span className="weight400">Use this mandate for multi-cities / multi-outlets</span>
													</label>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="col-xs-12 text-center ftrbtn btncel">
									<button
										className="btn btn-primary w100"
										onClick={() => {
											if (this.state.invalidBankDetails === true) {
												this.setState({ errorCd: 1, errMsg: "Bank does not participate in NACH! Kindly select a different Bank to proceed." });
												return false;
											}
											// else if(!('bankIfsc' in this.state.formData && this.state.formData.bankIfsc)){
											// 	this.setState({ errorCd: 1, errMsg: 'Please enter IFSC Code' });
											// 	return false;
											// }
											this.validateBankDetails();
										}}
									>
										Proceed
									</button>
								</div>
							</section>
						)}

						{currentSection === "accountAndEmiDetails" && (
							<section className="pull-left col-xs-12 p0 midsec">
								<div className="container mid-otr">
									<div className="col-xs-12 dwhtbg">
										<div className="col-xs-12 col-sm-6 col-sm-offset-3 p0">
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input
													type="text"
													name="accountHolderName"
													ref="holderName"
													value={this.state.formData.holderName}
													onChange={(e) => this.formUpdater(e, "holderName")}
													className={this.state.formData.holderName != "" ? "form-control anmtlbl" : "form-control"}
													onFocus={(e) => this.handleFocus(e)}
													onBlur={(e) => this.handleBlur(e, "holderName")}
												/>
												<label>Account Holder Name</label>
											</div>
											<div className="col-xs-12 p0 grytxt2 mb10">Do not write salutation (Mr, Mrs, etc) in account holders name</div>
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input
													type="text"
													name="accountNumber"
													ref="accNo"
													className={this.state.formData.accNo != "" ? "form-control anmtlbl" : "form-control"}
													value={this.state.formData.accNo}
													onChange={(e) => this.formUpdater(e, "accNo")}
													onFocus={(e) => this.handleFocus(e)}
													onBlur={(e) => this.handleBlur(e, "accNo")}
													maxLength="24"
												/>
												<label>Bank Account Number</label>
											</div>
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input
													type="text"
													ref="confAccNoRef"
													className={this.state.formData.confAccNo != "" ? "form-control anmtlbl" : "form-control"}
													value={this.state.formData.confAccNo}
													onChange={(e) => this.formUpdater(e, "confAccNo")}
													onFocus={() => helperFunc.handleInputFocus(event)}
													onBlur={() => helperFunc.handleInputBlur(event)}
													maxLength="24"
												/>
												<label>Confirm Bank Account Number</label>
											</div>
											<div className="col-xs-12 form-group p0 inrfrm lblanmt">
												<div className="col-xs-12 p0 slctbx">
													{/* <select name="" id="" className="form-control">
											<option value="">Select</option>
											<option value="">Single</option>
										</select> */}
													<select ref="selectAccType" value={this.state.formData.accountType} className="form-control" onChange={(e) => this.formUpdater(e, "accountType")}>
														<option value="">Select</option>
														<option value="Savings">Savings</option>
														<option value="Current">Current</option>
														<option value="CashCredit">C/C</option>
													</select>
													<label className="selectLabel">Account Type</label>
												</div>
											</div>
											<div className="col-xs-12 form-group p0 inrfrm lblanmt">
												<div className="col-xs-12 p0 slctbx">
													{/* <select name="" id="" className="form-control">
											<option value="">Select</option>
											<option value="">Single</option>
										</select> */}
													<select ref="modeOfOprn" value={this.state.formData.modeOpr} className="form-control" onChange={(e) => this.formUpdater(e, "modeOpr")}>
														<option value="">Select</option>
														<option value="Single">Single</option>
														<option value="Joint">Joint</option>
														<option value="Either">E/S</option>
													</select>
													<label className="selectLabel">Mode of operation</label>
												</div>
											</div>
											{/* <div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<span style={{ 'fontSize': '13px', 'top': '11px', 'position': 'relative', 'color': '#999' }}>ECS Start Date</span>
									<div ref="strtDateEcsDetails" className="col-xs-12 p0 input-daterange">
										<DatePicker  dateFormat="YYYY-MM-DD" minDate={this.state.tempMinStart}  maxDate={this.state.tempMaxStart} value={this.state.tempStart} onChange={this.handleDateStart} showClearButton={false} disabled/>
									</div>
								</div>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input ref="invoiceEmailAddrRef" type="text" value={this.state.formData.invoiceEmail} onChange={(e) => this.formUpdater(e, 'invoiceEmail')} className={(this.state.formData.invoiceEmail != '') ? "form-control anmtlbl" : "form-control"} onFocus={() => helperFunc.handleInputFocus(event)} onBlur={() => helperFunc.handleInputBlur(event)} />
									<label>Invoice Email Address </label>
								</div>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<div className="col-xs-12 p0 slctbx">
									<select ref="debitFrequencyRef" className="form-control" onChange={(e) => this.formUpdater(e, 'DebitFrequency')}>
										<option value="mn">Monthly</option>
									</select>
									<label className="selectLabel">Debit Frequency</label>
									</div>
								</div> */}
											<div className="col-xs-12 form-group p0 inrfrm lblanmt">
												<div className="col-xs-12 p0 slctbx">
													<select
														ref="debitDatesRef"
														id="dbDate"
														className="form-control"
														// onChange={(e) => this.formUpdater(e, 'siDebitDate')}
														// value={this.state.formData.siDebitDate}
														onChange={(e) => this.formUpdater(e, "debitDates")}
														value={this.state.formData.debitDates}
													>
														<option value="">Select</option>
														{Object.keys(this.state.debitDateArr).map((key, i) => (
															<option key={i} value={key}>
																{this.state.debitDateArr[key]}
															</option>
														))}
													</select>
													<label className="selectLabel">Debit Date</label>
												</div>
											</div>
											{/* <div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input ref="ecsAmtRef" type="text" className={(this.state.formData.ecsAmount != '') ? "form-control anmtlbl" : "form-control"} value={this.state.formData.ecsAmount} onChange={(e) => this.formUpdater(e, 'ecsAmount')} onFocus={() => helperFunc.handleInputFocus(event)} onBlur={() => helperFunc.handleInputBlur(event)} disabled={true} />
									<label>Minimum Billing Amount</label>
								</div>
								<span className="col-xs-12 p0 mb10 sbtxt">(At least <i className="gen_spr rup11_i"></i>{parseFloat(minEcsAmt)} *Inclusive of Tax)</span>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input type="text" className={(this.state.formData.ecsMaxAmount != '') ? "form-control anmtlbl" : "form-control"} value={this.state.formData.ecsMaxAmount} onChange={(e) => this.formUpdater(e, 'ecsMaxAmount')} onFocus={(e) => this.handleFocus(e)} onBlur={() => helperFunc.handleInputBlur(event)} maxLength="24" />
									<label>Maximum Billing Amount</label>
								</div>
								<span className="col-xs-12 p0 mb10 sbtxt">(Maximum Amount to be debited per transaction)	</span>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input ref="ecsMaxAmount" type="text" className={(this.state.formData.ecsMaxAmount_conf != '') ? "form-control anmtlbl" : "form-control"} value={this.state.formData.ecsMaxAmount_conf} onChange={(e) => this.formUpdater(e, 'ecsMaxAmount_conf')} onFocus={() => helperFunc.handleInputFocus(event)} onBlur={() => helperFunc.handleInputBlur(event)} maxLength="24" />
									<label>Confirm Maximum Billing Amount</label>
								</div> */}
											{/* {(this.state.netbankfactConfirm_modal == true || this.state.hideShowEnach == 1 || this.state.iciciMandate == 1) &&
									<span>										 
										<span className="col-xs-12 p0 mt10 mb10 blkhd"> {(this.state.formData.bankName != '' && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1) ? "Direct Debit Details" : "E-Nach Token Details"}
										</span>
										<span className="col-xs-12 p0 mb10 subtxt">{(this.state.formData.bankName != '' && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1) ? "For Direct Debit  verification, you are required to do OTP verification from your Mobile number that's registered with your bank" : "You are required to pay token of maximum &#8377; 2 for E-Nach verification through Net Banking or Debit Card."}
										</span>
										<div className="col-xs-12 p0">
											<span className="col-xs-12 p0 mt10 mb10 duplichkbox">
												{(this.state.formData.bankName != '' && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1) == 1 ? "Send OTP verification link" : "Send Payment Portal Link"}
											</span>
											
										</div>
									</span>
								} */}
											{this.checkEcsEligible() && (
												<div>
													<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
														<input
															type="text"
															className={this.state.e_mandate_data.mobile_number != "" ? "form-control anmtlbl" : "form-control"}
															ref="mobile_number"
															pattern="[0-9]*"
															inputMode="numeric"
															maxLength={10}
															value={this.state.e_mandate_data.mobile_number}
															onChange={(e) => this.digitalMandateUpdater(e, "mobile_number")}
															onFocus={() => helperFunc.handleInputFocus(event)}
															onBlur={() => helperFunc.handleInputBlur(event)}
														/>
														<label>Mobile number for token link</label>
													</div>
													<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
														<input
															type="text"
															className={this.state.e_mandate_data.email_id != "" ? "form-control anmtlbl" : "form-control"}
															ref="email_id"
															value={this.state.e_mandate_data.email_id}
															onChange={(e) => this.digitalMandateUpdater(e, "email_id")}
															onFocus={() => helperFunc.handleInputFocus(event)}
															onBlur={() => helperFunc.handleInputBlur(event)}
														/>
														<label>Email Id</label>
													</div>
												</div>
											)}
											{/* {(this.state.iciciMandate == 1 || ('bankName' in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1)) && 
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<div className="col-xs-12 p0 input-daterange">
										<DatePicker dateFormat="YYYY-MM-DD" id="dateOfBirth" value={this.state.e_mandate_data.dob} onChange={this.handleDobChange} showClearButton={false}
										onFocus={() => {
											var offset = 300;
											$('html, body').animate({
											scrollTop: $("#dateOfBirth").offset().top + offset
											}, 1000);
										}} 
										/>
										<label className="date-lbl">Date Of Birth</label>
										<i className="cals_icon"></i>
									</div>
								</div>} */}
											{this.state.enachEligible == 1 && "bankName" in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(" ").indexOf("IC123ICI") > -1 && (
												<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
													<div className="col-xs-12 p0 input-daterange">
														<DatePicker
															dateFormat="YYYY-MM-DD"
															id="dateOfBirth"
															value={this.state.e_mandate_data.dob}
															onChange={this.handleDobChange}
															showClearButton={false}
															onFocus={() => {
																var offset = 300;
																$("html, body").animate(
																	{
																		scrollTop: $("#dateOfBirth").offset().top + offset,
																	},
																	1000,
																);
															}}
														/>
														<label className="date-lbl">Date Of Birth</label>
														<i className="cals_icon"></i>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
								<div className="col-xs-12 text-center ftrbtn btncel">
									{/* <button className="btn btn-primary w100">Send Token Link</button> */}

									{this.state.innerDiv == true ? (
										<button
											onClick={(e) => {
												// this.setState({hideDOBOnVerifyAPI: true});
												thisObj.cardValidator("validateCard");
											}}
											className="btn btn-primary w100"
										>
											{this.checkEcsEligible() ? "Send Token Link" : "Proceed"}
										</button>
									) : (
										<button
											onClick={() => {
												hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
											}}
											className={tabType == 2 ? "btn btn-primary w50" : "btn btn-primary w100"}
										>
											Proceed to Make Payment
										</button>
									)}

									{/* {this.state.innerDiv == true ? <button  onClick={(e)=>thisObj.cardValidator('validateCard')} className= "btn btn-primary w100">Save & Proceed</button> :
						<button onClick={() => { hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id) }} className={(tabType == 2)?"btn btn-primary w50":"btn btn-primary w100"}>Proceed to Make Payment</button>} */}
								</div>
							</section>
						)}
					</div>
				)}
				{mandate == "false" && (
					<div>
						{currentSection === "accountAndEmiDetails" && (
							<section className="pull-left col-xs-12 p0 midsec_blkbg">
								<div className="container mid-otr">
									<div className="col-xs-12 dwhtbg">
										<div className="col-xs-12 col-sm-6 col-sm-offset-3 p0">
											<h1 className="font16">
												<strong>Fill Account Details</strong>
											</h1>
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input
													type="text"
													name="accountHolderName"
													ref="holderName"
													value={this.state.formData.holderName}
													onChange={(e) => this.formUpdater(e, "holderName")}
													className={this.state.formData.holderName != "" ? "form-control anmtlbl" : "form-control"}
													onFocus={(e) => this.handleFocus(e)}
													onBlur={(e) => this.handleBlur(e, "holderName")}
												/>
												<label>Account Holder Name</label>
											</div>
											{/* <div className="col-xs-12 p0 grytxt2 mb10">Do not write salutation (Mr, Mrs, etc) in account holders name</div> */}
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input
													type="text"
													name="accountNumber"
													ref="accNo"
													className={this.state.formData.accNo != "" ? "form-control anmtlbl" : "form-control"}
													value={this.state.formData.accNo}
													onChange={(e) => this.formUpdater(e, "accNo")}
													onFocus={(e) => this.handleFocus(e)}
													onBlur={(e) => this.handleBlur(e, "accNo")}
													maxLength="24"
												/>
												<label> Account Number</label>
											</div>
											<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												{/* <input type="text" className="form-control" /> */}
												<input
													type="text"
													ref="confAccNoRef"
													className={this.state.formData.confAccNo != "" ? "form-control anmtlbl" : "form-control"}
													value={this.state.formData.confAccNo}
													onChange={(e) => this.formUpdater(e, "confAccNo")}
													onFocus={() => helperFunc.handleInputFocus(event)}
													onBlur={() => helperFunc.handleInputBlur(event)}
													maxLength="24"
												/>
												<label>Re-enter Account Number</label>
											</div>
											<div className="col-xs-12 form-group p0 inrfrm lblanmt">
												<div className="col-xs-12 p0 slctbx">
													{/* <select name="" id="" className="form-control">
											<option value="">Select</option>
											<option value="">Single</option>
										</select> */}
													<select ref="selectAccType" value={this.state.formData.accountType} className="form-control" onChange={(e) => this.formUpdater(e, "accountType")}>
														<option value="">Select</option>
														<option value="Savings">Savings</option>
														<option value="Current">Current</option>
														{/* <option value="CashCredit">C/C</option> */}
													</select>
													<label className="selectLabel">Account Type</label>
												</div>
											</div>

											<div className="col-xs-12 form-group p0 inrfrm lblanmt">
												<div className="col-xs-12 p0 slctbx">
													<select ref="selectPayType" value={this.state.formData.user_pay_mode} className="form-control" onChange={(e) => this.formUpdater(e, "user_pay_mode")}>
														<option value="">Select</option>
														<option value="nb">Net Banking</option>
														<option value="dc">Debit Card</option>
													</select>
													<label className="selectLabel">Payment Type</label>
												</div>
											</div>

											{/* <div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
												<input
													ref="bankIfscCodeSel"
													type="text"
													className={this.state.formData.bankIfsc != "" ? "form-control anmtlbl" : "form-control"}
													value={this.state.formData.bankIfsc}
													onChange={(e) => this.formUpdater(e, "bankIfsc")}
													onFocus={() => helperFunc.handleInputFocus(event)}
													onBlur={() => helperFunc.handleInputBlur(event)}
												/>
												<label>Enter IFSC Code</label>
											</div> */}
											{/* <div className="col-xs-12 form-group p0 inrfrm lblanmt">
										<div className="col-xs-12 p0 slctbx"> */}
											{/* <select name="" id="" className="form-control">
											<option value="">Select</option>
											<option value="">Single</option>
										</select> */}
											{/* <select ref="modeOfOprn" value={this.state.formData.modeOpr} className="form-control" onChange={(e) => this.formUpdater(e, "modeOpr")}>
												<option value="">Select</option>
												<option value="Single">Single</option>
												<option value="Joint">Joint</option>
												<option value="Either">E/S</option>
											</select>
											<label className="selectLabel">Mode of operation</label>
										</div>
									</div> */}
											{/* <div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<span style={{ 'fontSize': '13px', 'top': '11px', 'position': 'relative', 'color': '#999' }}>ECS Start Date</span>
									<div ref="strtDateEcsDetails" className="col-xs-12 p0 input-daterange">
										<DatePicker  dateFormat="YYYY-MM-DD" minDate={this.state.tempMinStart}  maxDate={this.state.tempMaxStart} value={this.state.tempStart} onChange={this.handleDateStart} showClearButton={false} disabled/>
									</div>
								</div>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input ref="invoiceEmailAddrRef" type="text" value={this.state.formData.invoiceEmail} onChange={(e) => this.formUpdater(e, 'invoiceEmail')} className={(this.state.formData.invoiceEmail != '') ? "form-control anmtlbl" : "form-control"} onFocus={() => helperFunc.handleInputFocus(event)} onBlur={() => helperFunc.handleInputBlur(event)} />
									<label>Invoice Email Address </label>
								</div>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<div className="col-xs-12 p0 slctbx">
									<select ref="debitFrequencyRef" className="form-control" onChange={(e) => this.formUpdater(e, 'DebitFrequency')}>
										<option value="mn">Monthly</option>
									</select>
									<label className="selectLabel">Debit Frequency</label>
									</div>
								</div> */}
											<div className="col-xs-12 form-group p0 inrfrm lblanmt">
												<div className="col-xs-12 p0 slctbx">
													<select
														ref="debitDatesRef"
														id="dbDate"
														className="form-control"
														// onChange={(e) => this.formUpdater(e, 'siDebitDate')}
														// value={this.state.formData.siDebitDate}
														onChange={(e) => this.formUpdater(e, "debitDates")}
														value={this.state.formData.debitDates}
													>
														<option value="">Select</option>
														{Object.keys(this.state.debitDateArr).map((key, i) => (
															<option key={i} value={key}>
																{this.state.debitDateArr[key]}
															</option>
														))}
													</select>
													<label className="selectLabel">Debit Date</label>
												</div>
											</div>
											{/* <div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input ref="ecsAmtRef" type="text" className={(this.state.formData.ecsAmount != '') ? "form-control anmtlbl" : "form-control"} value={this.state.formData.ecsAmount} onChange={(e) => this.formUpdater(e, 'ecsAmount')} onFocus={() => helperFunc.handleInputFocus(event)} onBlur={() => helperFunc.handleInputBlur(event)} disabled={true} />
									<label>Minimum Billing Amount</label>
								</div>
								<span className="col-xs-12 p0 mb10 sbtxt">(At least <i className="gen_spr rup11_i"></i>{parseFloat(minEcsAmt)} *Inclusive of Tax)</span>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input type="text" className={(this.state.formData.ecsMaxAmount != '') ? "form-control anmtlbl" : "form-control"} value={this.state.formData.ecsMaxAmount} onChange={(e) => this.formUpdater(e, 'ecsMaxAmount')} onFocus={(e) => this.handleFocus(e)} onBlur={() => helperFunc.handleInputBlur(event)} maxLength="24" />
									<label>Maximum Billing Amount</label>
								</div>
								<span className="col-xs-12 p0 mb10 sbtxt">(Maximum Amount to be debited per transaction)	</span>
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<input ref="ecsMaxAmount" type="text" className={(this.state.formData.ecsMaxAmount_conf != '') ? "form-control anmtlbl" : "form-control"} value={this.state.formData.ecsMaxAmount_conf} onChange={(e) => this.formUpdater(e, 'ecsMaxAmount_conf')} onFocus={() => helperFunc.handleInputFocus(event)} onBlur={() => helperFunc.handleInputBlur(event)} maxLength="24" />
									<label>Confirm Maximum Billing Amount</label>
								</div> */}
											{/* {(this.state.netbankfactConfirm_modal == true || this.state.hideShowEnach == 1 || this.state.iciciMandate == 1) &&
									<span>										 
										<span className="col-xs-12 p0 mt10 mb10 blkhd"> {(this.state.formData.bankName != '' && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1) ? "Direct Debit Details" : "E-Nach Token Details"}
										</span>
										<span className="col-xs-12 p0 mb10 subtxt">{(this.state.formData.bankName != '' && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1) ? "For Direct Debit  verification, you are required to do OTP verification from your Mobile number that's registered with your bank" : "You are required to pay token of maximum &#8377; 2 for E-Nach verification through Net Banking or Debit Card."}
										</span>
										<div className="col-xs-12 p0">
											<span className="col-xs-12 p0 mt10 mb10 duplichkbox">
												{(this.state.formData.bankName != '' && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1) == 1 ? "Send OTP verification link" : "Send Payment Portal Link"}
											</span>
											
										</div>
									</span>
								} */}
											{this.checkEcsEligible() && (
												<div>
													<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
														<input
															type="text"
															className={this.state.e_mandate_data.mobile_number != "" ? "form-control anmtlbl" : "form-control"}
															ref="mobile_number"
															pattern="[0-9]*"
															inputMode="numeric"
															maxLength={10}
															value={this.state.e_mandate_data.mobile_number}
															onChange={(e) => this.digitalMandateUpdater(e, "mobile_number")}
															onFocus={() => helperFunc.handleInputFocus(event)}
															onBlur={() => helperFunc.handleInputBlur(event)}
														/>
														<label>Mobile Number </label>
													</div>
													<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
														<input
															type="text"
															className={this.state.e_mandate_data.email_id != "" ? "form-control anmtlbl" : "form-control"}
															ref="email_id"
															value={this.state.e_mandate_data.email_id}
															onChange={(e) => this.digitalMandateUpdater(e, "email_id")}
															onFocus={() => helperFunc.handleInputFocus(event)}
															onBlur={() => helperFunc.handleInputBlur(event)}
														/>
														<label>Email Id</label>
													</div>
												</div>
											)}
											{/* {(this.state.iciciMandate == 1 || ('bankName' in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(' ').indexOf('ICICI') > -1)) && 
								<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
									<div className="col-xs-12 p0 input-daterange">
										<DatePicker dateFormat="YYYY-MM-DD" id="dateOfBirth" value={this.state.e_mandate_data.dob} onChange={this.handleDobChange} showClearButton={false}
										onFocus={() => {
											var offset = 300;
											$('html, body').animate({
											scrollTop: $("#dateOfBirth").offset().top + offset
											}, 1000);
										}} 
										/>
										<label className="date-lbl">Date Of Birth</label>
										<i className="cals_icon"></i>
									</div>
								</div>} */}
											{this.state.enachEligible == 1 && "bankName" in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(" ").indexOf("IC123ICI") > -1 && (
												<div className="col-xs-12 form-group p0 mt10 inrfrm lblanmt">
													<div className="col-xs-12 p0 input-daterange">
														<DatePicker
															dateFormat="YYYY-MM-DD"
															id="dateOfBirth"
															value={this.state.e_mandate_data.dob}
															onChange={this.handleDobChange}
															showClearButton={false}
															onFocus={() => {
																var offset = 300;
																$("html, body").animate(
																	{
																		scrollTop: $("#dateOfBirth").offset().top + offset,
																	},
																	1000,
																);
															}}
														/>
														<label className="date-lbl">Date Of Birth</label>
														<i className="cals_icon"></i>
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="help_button active" onClick={() => hashHistory.push("/Enach_FAQ/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id)}>
										FAQs
									</div>

									{/* {this.state.hide == 1 && <div className="help_blkbg" onClick={() => this.closePopUp()} />}

									<div className="help_button active" onClick={() => this.helpFunction()}>
										<span className="whatsappicon"></span> Help
										{this.state.popUp == 1 && (
											<div className="helpbutton_popup">
												<div className="col-xs-12 p0 help_call_btm" onClick={() => this.redirect(0)}>
													<div className="col-xs-10 p0">
														<div className="col-xs-12 p0 blkhd weight600">Ramesh Jumare</div>
														<div className="col-xs-12 p0 grytxt2">{this.state.mobileData[0]}</div>
													</div>
													<div className="col-xs-2 p0 text-right">
														<span className="whatsappicon"></span>
													</div>
												</div>

												<div className="col-xs-12 p0 help_call_btm">
													<div className="col-xs-10 p0" onClick={() => this.redirect(1)}>
														<div className="col-xs-12 p0 blkhd weight600">Pravesh Kumar</div>
														<div className="col-xs-12 p0 grytxt2">{this.state.mobileData[1]}</div>
													</div>
													<div className="col-xs-2 p0 text-right">
														<span className="whatsappicon"></span>
													</div>
												</div>
												<div className="col-xs-12 p0 help_call_btm" onClick={() => this.redirect(2)}>
													<div className="col-xs-10 p0">
														<div className="col-xs-12 p0 blkhd weight600">Mahesh Kirakudave</div>
														<div className="col-xs-12 p0 grytxt2">{this.state.mobileData[2]}</div>
													</div>
													<div className="col-xs-2 p0 text-right">
														<span className="whatsappicon"></span>
													</div>
												</div>
												<div className="col-xs-12 p0 help_call_btm" onClick={() => this.redirect(3)}>
													<div className="col-xs-10 p0">
														<div className="col-xs-12 p0 blkhd weight600">Dharamraj</div>
														<div className="col-xs-12 p0 grytxt2">{this.state.mobileData[3]}</div>
													</div>
													<div className="col-xs-2 p0 text-right">
														<span className="whatsappicon"></span>
													</div>
												</div>
												<div className="col-xs-12 p0 help_call_btm" onClick={() => this.redirect(4)}>
													<div className="col-xs-10 p0">
														<div className="col-xs-12 p0 blkhd weight600">Vinod Shigvan</div>
														<div className="col-xs-12 p0 grytxt2">{this.state.mobileData[4]}</div>
													</div>
													<div className="col-xs-2 p0 text-right">
														<span className="whatsappicon"></span>
													</div>
												</div>
											</div>
										)}
									</div> */}
								</div>
								<div className="col-xs-12 text-center ftrbtn btncel">
									{/* <button className="btn btn-primary w100">Send Token Link</button> */}

									{this.state.innerDiv == true ? (
										<button
											onClick={(e) => {
												// this.setState({hideDOBOnVerifyAPI: true});
												thisObj.cardValidator("validateCard");
											}}
											className="btn btn-primary w100"
										>
											{this.checkEcsEligible() ? "Send Token Link" : "Proceed"}
										</button>
									) : (
										<button
											onClick={() => {
												hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
											}}
											className={tabType == 2 ? "btn btn-primary w50" : "btn btn-primary w100"}
										>
											Proceed to Make Payment
										</button>
									)}

									{/* {this.state.innerDiv == true ? <button  onClick={(e)=>thisObj.cardValidator('validateCard')} className= "btn btn-primary w100">Save & Proceed</button> :
						<button onClick={() => { hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id) }} className={(tabType == 2)?"btn btn-primary w50":"btn btn-primary w100"}>Proceed to Make Payment</button>} */}
								</div>
							</section>
						)}
					</div>
				)}

				{currentSection === "tokenTransactionLinkDetails" && (
					<section className="pull-left col-xs-12 p0 midsec">
						<div className="container mid-otr">
							{"bankName" in this.state.formData && this.state.formData.bankName && this.state.formData.bankName.split(" ").indexOf("IC123ICI") > -1 ? (
								<div className="col-xs-12 dwhtbg">
									<div className="col-xs-12 p0 mt20 mb20 blkhd weight700 font17">Thank you for submitting bank account details.</div>
									<div className="col-xs-12 p0 mb20 blkhd">{`Direct Debit verification link Sent to ${this.state.e_mandate_data && this.state.e_mandate_data.mobile_number ? this.maskPhoneNumber(this.state.e_mandate_data.mobile_number) : ""}`}</div>
									<div className="col-xs-12 p0 mb20 blkhd">Please tell customer to click on that link for OTP verification.</div>
									<div className="col-xs-12 p0 text-center mt20 mb20">
										<span className="messageimage"></span>
									</div>
									<div className="help_button active" onClick={() => hashHistory.push("/Enach_FAQ/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id)}>
										FAQs
									</div>
								</div>
							) : (
								<div className="col-xs-12 dwhtbg">
									<div className="col-xs-12 p0 mt20 mb20 blkhd weight700 font17">Thank you for submitting bank account details.</div>
									<div className="col-xs-12 p0 mb20 blkhd">{`eNACH token transaction link sent to ${this.state.e_mandate_data && this.state.e_mandate_data.mobile_number ? this.maskPhoneNumber(this.state.e_mandate_data.mobile_number) : ""} ${
										this.state.e_mandate_data && this.state.e_mandate_data.email_id ? `& ${this.state.e_mandate_data.email_id}` : ""
									}`}</div>
									<div className="col-xs-12 p0 mb20 blkhd">Please tell customer to click on that link to make token transaction of maximum 2/- and verify bank account for eMandate registration.</div>
									<div className="col-xs-12 p0 text-center mt20 mb20">
										<span className="messageimage"></span>
									</div>
									<div className="help_button active" onClick={() => hashHistory.push("/Enach_FAQ/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id)}>
										FAQs
									</div>
								</div>
							)}
						</div>
						<div className="col-xs-12 text-center ftrbtn btncel">
							<button
								className="btn btn-primary w100"
								onClick={() => {
									// hashHistory.push("/make-payment/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id);
									hashHistory.push("payment-mode/" + this.props.params.parentid + "/" + this.props.params.master_transaction_id + "/cybshdyi766");
								}}
							>
								Proceed
							</button>
						</div>
					</section>
				)}

				{this.state.errorCd == 1 && (
					<div className="col-xs-12 text-center ftrbtn btncel">
						<div>
							<Alert bsStyle="danger">
								<div>
									<span>{this.state.errMsg}</span>
									<span style={{ float: "right" }} onClick={this.closeAlert.bind(this)}>
										<u>
											<b>Close</b>
										</u>
									</span>
								</div>
							</Alert>
						</div>
					</div>
				)}

				{currentSection === "physicalMandate" && (
					<div>
						<section className="pull-left col-xs-12 p0 midsec">
							<div className="container mid-otr">
								<div className="col-xs-12 p0 dwhtbg">
									<div className="col-xs-12 mt20 mb20 grytxt2">You Will be penalised if photo is not uploaded or uploaded photo is not clear/Partially uploaded/bogus/inappropriate.</div>
									<div className="col-xs-12 mb20 grytxt2">Incentive will not be paid if physical NACH mandate is not submitted to accounts.</div>
									<div className="col-xs-12 mandateupload">
										{/* enach--start */}

										{nach_image_preview != "" && (
											<div className="col-xs-12 p0 postbl mb20">
												<div className="poscell mandatepiccell">
													<span className="docpic docimgpic">
														<img src={nach_image_show == 1 && !nach_image_file_path ? "http://192.168.22.103/salesDashboard/view_chequeImages.php?path=" + nach_image_preview : nach_image_preview} alt="" width="100%" />
														{nach_image_remove ? (
															<span className="col-xs-12 doctxt" onClick={(e) => thisObj.resetImage("nach_image")}>
																Reupload <i className="reupload_icon ml-5"></i>
															</span>
														) : (
															""
														)}
													</span>
												</div>
												<span className="poscell blkhd weight600">Nach Photo</span>
											</div>
										)}

										{nach_image_preview == "" && (
											<div className="col-xs-12 p0 postbl mb20">
												<div className="poscell mandatepiccell">
													<Dropzone accept="image/jpeg, image/png" onDrop={(evt) => thisObj.onDrop(evt, "nach_image")}>
														<span className="docpic text-center">
															<span className="gryuploadicon"></span>
															<span className="col-xs-12 p0 mandategrytxt">Upload</span>
														</span>
													</Dropzone>
												</div>
												<span className="poscell blkhd weight600">Upload Nach Photo</span>
											</div>
										)}
										{/* enach--end */}

										<div className="col-xs-12 p0 geniodivider mb20"></div>

										{/* ecs--start */}

										{ecs_image_preview != "" && (
											<div className="col-xs-12 p0 postbl mb20">
												<div className="poscell mandatepiccell">
													<span className="docpic docimgpic">
														<img src={ecs_image_show == 1 && !ecs_image_file_path ? "http://192.168.22.103/salesDashboard/view_chequeImages.php?path=" + ecs_image_preview : ecs_image_preview} alt="" width="100%" />
														{ecs_image_remove ? (
															<span className="col-xs-12 doctxt" onClick={(e) => thisObj.resetImage("ecs_image")}>
																Reupload <i className="reupload_icon ml-5"></i>
															</span>
														) : (
															""
														)}
														<span className="reupload_icon ml-5"></span>
													</span>
												</div>
												<div className="poscell blkhd weight600">ECS Acknowledgement Slip</div>
											</div>
										)}

										{ecs_image_preview == "" && (
											<div className="col-xs-12 p0 postbl mb20">
												<div className="poscell mandatepiccell">
													<Dropzone onDrop={(evt) => thisObj.onDrop(evt, "ecs_image")}>
														<span className="docpic text-center">
															<span className="gryuploadicon"></span>
															<span className="col-xs-12 p0 mandategrytxt">Upload</span>
														</span>
													</Dropzone>
												</div>
												<div className="poscell blkhd weight600">Upload ECS Acknowledgement Slip</div>
											</div>
										)}
										{/* ecs--end */}

										<div className="col-xs-12 p0 geniodivider mb20"></div>

										{/* Cheque--start */}

										{cheque_image_preview != "" && (
											<div className="col-xs-12 p0 postbl mb20">
												<div className="poscell mandatepiccell">
													<span className="docpic docimgpic">
														<img src={cheque_image_show == 1 && !cheque_image_file_path ? "http://192.168.22.103/salesDashboard/view_chequeImages.php?path=" + cheque_image_preview : cheque_image_preview} alt="" width="100%" />
														{cheque_image_remove ? (
															<span className="col-xs-12 doctxt" onClick={(e) => thisObj.resetImage("cheque_image")}>
																Reupload <i className="reupload_icon ml-5"></i>
															</span>
														) : (
															""
														)}
														<span className="reupload_icon ml-5"></span>
													</span>
												</div>
												<div className="poscell blkhd weight600">Cancelled/Initial Payment Cheque</div>
											</div>
										)}

										{cheque_image_preview == "" && (
											<div className="col-xs-12 p0 postbl mb20">
												<div className="poscell mandatepiccell">
													<Dropzone onDrop={(evt) => thisObj.onDrop(evt, "cheque_image")}>
														<span className="docpic text-center">
															<span className="gryuploadicon"></span>
															<span className="col-xs-12 p0 mandategrytxt">Upload</span>
														</span>
													</Dropzone>
												</div>
												<div className="poscell blkhd weight600">Upload Cancelled/Initial Payment Cheque</div>
											</div>
										)}
										{/* Cheque--end */}
									</div>
								</div>
								{((this.state.hideShowEnach == 0 && this.state.e_mandate_data.mp_portal == "2") || this.state.netbankfactConfirm_modal == false) && (
									<div className="col-xs-12 text-center ftrbtn btncel">
										{this.state.allowSkipMandate == 0 && (
											<button type="button" className="btn btn-default w50" onClick={() => this.skipMandate()}>
												Skip Mandate
											</button>
										)}
										<button className={this.state.allowSkipMandate == 0 ? "btn btn-primary w50" : "btn btn-primary mt10"} onClick={this.savePayment.bind(this, this.state.currentTab, true)}>
											Proceed
										</button>
									</div>
								)}
								{(this.state.hideShowEnach == 1 || (this.state.hideShowEnach == 0 && this.state.e_mandate_data.mp_portal != "2" && this.state.netbankfactConfirm_modal == true)) && (
									<div className="col-xs-12 text-center ftrbtn btncel">
										<button className="btn btn-primary mt10" onClick={this.savePayment.bind(this, this.state.currentTab, true)}>
											Proceed
										</button>
									</div>
								)}
							</div>
						</section>
					</div>
				)}

				<section className="pull-left col-xs-12 p0 midsec ecspayment">
					{this.state.innerDiv && <div id="innerdiv"></div>}


					<Modal show={this.state.alertPop == 1} onHide={this.closeCurrentAlert} className="modal fade infomappop" tabIndex="-1">
					<Modal.Body>
			    		<p className="infohd">Current corporate account is not eligible for E-Nach!</p>
			    		<div className="p0 mt20 btnfix text-right">
							<button type="button" className="btn btn-primary w30 pullnone" onClick={this.closeCurrentAlert}>Ok</button>
						</div>
					</Modal.Body>
				</Modal>
					<Modal show={showModal == 1} onHide={this.closeModal.bind(this)} className="modal fade cmnpop matchingdata">
						<Modal.Header>
							<h4 className="modal-title col-xs-12 visible-xs">
								<span className="col-xs-11 p0">{modalTitle}</span>
								<a href="javascript:void(0)" onClick={this.closeModal.bind(this)} className="pull-right  rem_i"></a>
							</h4>
							<span className="col-xs-12 p0 subhd hidden-xs">{modalTitle}</span>
						</Modal.Header>
						<Modal.Body>
							<div className="gnbx nwbx">
								<p className="pull-left mt10 dta">{modalMsg}</p>
							</div>
							<div className="text-right p0 btnfix">
								<button type="button" className="btn btn-primary w100" onClick={this.closeModal.bind(this)}>
									Close
								</button>
							</div>
						</Modal.Body>
					</Modal>
					<Modal show={showModal == 2} onHide={this.closeModal.bind(this)} className="modal fade cmnpop matchingdata">
						<Modal.Header>
							<h4 className="modal-title col-xs-12 visible-xs">
								<span className="col-xs-11 p0">{modalTitle}</span>
								<a href="javascript:void(0)" onClick={this.closeModal.bind(this)} className="pull-right  rem_i"></a>
							</h4>
							<span className="col-xs-12 p0 subhd hidden-xs">{modalTitle}</span>
						</Modal.Header>
						<Modal.Body>
							<div className="gnbx nwbx">
								<p className="dta">
									Your bank does not qualify for E-Nach.
									<br></br>
									Click Ok to continue with Physical Mandate.
								</p>
							</div>
							<div className="text-right p0 btnfix">
								<button type="button" className="btn btn-primary w100" onClick={this.handleModal.bind(this, "handleEnach")}>
									Ok
								</button>
							</div>
						</Modal.Body>
					</Modal>
					<Modal show={this.state.netbankfact_modal} onHide={this.closeModal.bind(this)} className="modal fade cmnpop netbankfact">
						<Modal.Header>
							<h4 className="modal-title col-xs-12 visible-xs">
								<span className="col-xs-11 p0">Net Banking Facilityss</span>
								<a href="javascript:void(0)" onClick={this.closeModal.bind(this)} className="pull-right  rem_i"></a>
							</h4>
							<span className="col-xs-12 p0 subhd hidden-xs">Net Banking Facilitys</span>
						</Modal.Header>
						<Modal.Body>
							<div className="gnbx">
								<p>Do you have active net banking facility?</p>
								<div className="text-right p0 btnfix">
									<button type="button" className="btn btn-default w50" onClick={this.handleDigitalMandatePopup.bind(this, 0)}>
										No
									</button>
									<button type="button" className="btn btn-primary w50" onClick={this.handleDigitalMandatePopup.bind(this, 1)}>
										Yes
									</button>
								</div>
							</div>
						</Modal.Body>
					</Modal>
					<Modal show={showModal == 3} onHide={this.closeModal.bind(this)} className="modal fade cmnpop matchingdata">
						<Modal.Header>
							<h4 className="modal-title col-xs-12 visible-xs">
								<span className="col-xs-11 p0">Confirmation</span>
								<a href="javascript:void(0)" onClick={this.closeModal.bind(this)} className="pull-right  rem_i"></a>
							</h4>
							<span className="col-xs-12 p0 subhd hidden-xs">Confirmation</span>
						</Modal.Header>
						<Modal.Body>
							<div className="gnbx nwbx">
								<p className="pull-left mt10 dta">Are you sure, you want to delete this verification link?</p>
								<div className="text-right p0 btnfix">
									<button type="button" className="btn btn-default mr30" onHide={this.closeModal.bind(this)}>
										No
									</button>
									<button type="button" className="btn btn-primary" onClick={(e) => thisObj.cardValidator("deleteJdpay")}>
										Yes
									</button>
								</div>
							</div>
						</Modal.Body>
					</Modal>

					{(this.state.showLoader == 1 || this.state.setLoader == 1) && (
						<span>
							<div className="upLoader">
								<div className="showbox">
									<div className="loaderShow">
										<div className="component-loader">
											<div className="reverse-spinner"></div>
										</div>
									</div>
								</div>
							</div>
							{this.state.showOverlay == 1 && <div className="overLayLoader"></div>}
						</span>
					)}
					<CustomAlert classstyle={this.state.warning_type} message={this.state.alert_msg} parentWarning={this.closeWarning.bind(this, this.state.warning_action)} condition={this.state.isWarning} allowcondition={1} reasonmsg={""}></CustomAlert>
				</section>
			</div>
		);
	}
}
export default EcsMandate;
