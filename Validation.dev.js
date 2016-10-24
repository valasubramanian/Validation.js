/* Created By - Valasubramanian.s on 10-May-2015
* ------------------------------------------------------------------------------------------------- 
* Modified By - 
* ------------------------------------------------------------------------------------------------- 
* Purpose - Custome Validation jQuery Plugin
* -------------------------------------------------------------------------------------------------*/
function PageValidation(vid, Title, liTitle, isStepValidation) {
    return Validation.Start(vid, Title, liTitle, isStepValidation);
}
var Validation = new function () {
    this._$divid = "";
    this._$container = "";
    this._errMessage = "";
    this._isrequired = false;
    this._nbr = '0123456789';
    this._$currentdate = "";
    this._lwr = 'abcdefghijklmnopqrstuvwxyz';
    this._uwr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this._msgTitle = ""; this._msgliTitle = ""; this._isStepValidation = true;

    this.Start = function (vid, Title, liTitle, isStepValidation) {
        if (isStepValidation == undefined) { isStepValidation = true; }
        Validation._msgTitle = Title;
        Validation._msgliTitle = liTitle;
        Validation._isStepValidation = isStepValidation;
        return Validation.initvalidation("", "", vid);
    }
    this.initvalidation = function (divid, errcontainer, vid) {
        Validation._$container = "#" + errcontainer; Validation._$divid = "#" + divid; var _isValid = true; var _olcontent = "";
        if (Validation._isStepValidation) {
            $("#" + vid + ":visible .validate").each(function () {
                var _this = this;
                if (!Validation._$Jvalidate(_this)) {
                    _isValid = false;
                    Validation.appednStepValidationAlert(_this, Validation._errMessage);
                    return false;
                }
            });
        }
        else {
            $("#" + vid + ":visible .validate").each(function () {
                var _this = this;
                if (!Validation._$Jvalidate(_this)) {
                    _olcontent = _olcontent + '<li id="li_' + _this.id + '" class="div100 dleft"><label class="error dleft" id="lbl_' + _this.id + '" for="' + _this.id + '">' + Validation._errMessage + '</label></li>';
                    _isValid = false;
                }
            });
            if (!_isValid) {
                alert((Validation._msgliTitle + "<ul class='msgul'>" + _olcontent + "</ul>"), Validation._msgTitle, "");
                //bsc.WAlert("<ul class='msgul mrgtop10 div100 dleft'>" + _olcontent + "</ul>", "Validation");
            }
        }
        return _isValid;
    }
    this.appednStepValidationAlert = function (_this, errMsg) {
        var _target = _this; var th = $(_this); var _body = $('body');
        var _validAlert = $("<div class='step-validation' for='" + _this.id + "'><span class='top-arrow'>&nbsp;</span><div class='step-validation-msg'><i class='fa fa-ban'></i>&nbsp;&nbsp;" + errMsg + "</div></div>");

        var _pos = Validation.GetScreenCordinates(_target);
        _validAlert.css({ top: _pos.y + th.height() + 20 + 'px' });
        if (th.parent('.form-group,.input-group').length > 0) {
            _pos = Validation.GetScreenCordinates(th.parent('.form-group,.input-group')[0]);
        }
        _validAlert.css({ left: _pos.x + 'px' });
        _validAlert.css("max-width", $(_target).width() - 10 + 'px');
        Validation.removeStepValidationAlert();
        _body.append(_validAlert);
        setTimeout(function () { Validation.removeStepValidationAlert(true); }, 2000);
        th.bind('click', function () { Validation.removeStepValidationAlert(); });
        th.bind('keypress', function () { Validation.removeStepValidationAlert(); });
        $(window).resize(function () { Validation.reappendStepValidationAlert(); });
    }
    this.removeStepValidationAlert = function (isSlide) {
        if (isSlide == undefined) { isSlide = false; }
        if (isSlide) {
            $('div.step-validation').slideUp(function () { $(this).remove() });
        }
        else {
            $('div.step-validation').remove();
        }
    }
    this.reappendStepValidationAlert = function () {
        var _sv = $('div.step-validation');
        if (_sv.length > 0) {
            var _target = $('#' + _sv.attr('for'));
            if (_target != undefined && _target.length > 0) {
                var _pos = Validation.GetScreenCordinates(_target[0]);
                _sv.css({ top: _pos.y + _target.height() + 20 + 'px' });
                if (_target.parent('.form-group,.input-group').length > 0) {
                    _pos = Validation.GetScreenCordinates(_target.parent('.form-group,.input-group')[0]);
                }
                _sv.css({ left: _pos.x + 'px' });
            }
        }
    }
    this._$Jvalidate = function (obj) {
        if (obj.id == "") { return true; }
        var _$obj = $(obj);
        var _clsName = obj.className;
        var _arrval = new Array();
        _arrval = _clsName.split("{");
        Validation._isrequired = false;
        if (_arrval.length > 0) {
            _clsName = _arrval[_arrval.length - 1];
            _arrval = _clsName.split("}");
            _clsName = _arrval[0];
            _arrval = _clsName.split(",");
            var _valtype = "";
            if (_arrval.length > 0) {
                for (var _evali = 0; _evali < _arrval.length - 1; _evali++) {
                    _valtype = _arrval[_evali].toLowerCase();
                    switch (_valtype) {
                        case "req":
                        case "required":
                        case "dreq":
                        case "visreq":
                        case "togglereq":
                        case "chkreq":
                        case "ereq":
                            Validation._isrequired = true; var _blnResult = true;
                            if (!_$obj.hasClass("vroff")) {
                                if (_valtype == "dreq") {
                                    _evali = _evali + 1;
                                    var _trimVal = _RTrim(obj.value).toLowerCase(); var notValue = _arrval[_evali].toLowerCase();
                                    _blnResult = (_trimVal == "" || _trimVal == notValue) ? false : _blnResult;
                                    if (!_blnResult && _trimVal != "") {
                                        Validation._errMessage = _arrval[_arrval.length - 1] + " value should not be " + notValue + ".";
                                        return false;
                                    }
                                }
                                else if (_valtype == "togglereq" || _valtype == "chkreq") {
                                    _evali = _evali + 1;
                                    var _chkobj = $('#' + _arrval[_evali]);
                                    if (_chkobj.length > 0) {
                                        _blnResult = (_valtype == "togglereq" && !_chkobj[0].checked) ? Validation.RequiredValidate(obj) : (_valtype == "chkreq" && _chkobj[0].checked) ? Validation.RequiredValidate(obj) : _blnResult;
                                    }
                                }
                                else {
                                    _blnResult = (_valtype == "req" || _valtype == "required" || _valtype == "ereq" || (_valtype == "visreq" && _$obj.filter(":visible").length > 0 && _$obj.filter('[disabled="disabled"]')).length == 0) ? Validation.RequiredValidate(obj) : _blnResult;
                                }
                                if (_blnResult == false) {
                                    switch (obj.type) {
                                        case "text":
                                        case "password":
                                            Validation._errMessage = (_valtype == "ereq") ? _arrval[_arrval.length - 1] : _arrval[_arrval.length - 1] + " " + _$required;
                                            break;
                                        case "select-one":
                                            Validation._errMessage = (_valtype == "ereq") ? _arrval[_arrval.length - 1] : _arrval[_arrval.length - 1] + " " + _$required;
                                            break;
                                        case "checkbox":
                                            Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$requiredchk;
                                            break;
                                        default:
                                            Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$required;
                                            break;
                                    }
                                    return false;
                                }
                            }
                            break;
                        case "emailcmp":
                        case "pwdcmp":
                            _evali = _evali + 1;
                            var pwd = $('#' + _arrval[_evali]);
                            if (pwd.length > 0 && obj.value != pwd[0].value) {
                                Validation._errMessage = _valtype == "emailcmp" ? _$emailcmp : _$pwdcmp;
                                /*Validation._errMessage = Validation._errMessage.replace(/xxxx/, _arrval[_evali + 1]);*/
                                return false;
                            }
                            break;
                        case "domain":
                            var dname = _RTrim(obj.value);
                            for (var j = 0; j < dname.length; j++) {
                                var dh = dname.charAt(j);
                                var hh = dh.charCodeAt(0);
                                if ((hh > 47 && hh < 59) || (hh > 64 && hh < 91) || (hh > 96 && hh < 123) || hh == 45 || hh == 46) {
                                    if ((j == 0 || j == dname.length - 1) && hh == 45) {
                                        Validation._errMessage = _arrval[_evali + 1] + " should not begin or end with '-'";
                                        return false;
                                    }
                                }
                                else {
                                    Validation._errMessage = _arrval[_evali + 1] + " should not have special characters";
                                    return false;
                                }
                            }
                            break;
                        case "email":
                            if (Validation.EmailValidation(obj) == false) {
                                Validation._errMessage = _$email;
                                return false;
                            }
                            break;
                        case "url":
                            if (Validation.isUrl(obj.value) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$url;
                                return false;
                            }
                            break;
                        case "cusurl": //validate start with "http" / "https" / "ftp" / "www" / "/"
                            if (Validation.isCusUrl(obj.value) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$url;
                                return false;
                            }
                            break;
                        case "mincl":
                            _evali = _evali + 1;
                            if (_RTrim(obj.value).length < _arrval[_evali]) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$mincl.replace(/xxxx/, _arrval[_evali]);
                                return false;
                            }
                            break;
                        case "maxcl":
                            _evali = _evali + 1;
                            if (_RTrim(obj.value).length > parseInt(_arrval[_evali], 10)) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$maxcl.replace(/xxxx/, _arrval[_evali]);
                                return false;
                            }
                            break;
                        case "eqcl":
                            _evali = _evali + 1; var _trimVal = _RTrim(obj.value);
                            if (_trimVal.length > 0 && _trimVal.length != parseInt(_arrval[_evali], 10)) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$eqcl.replace(/xxxx/, _arrval[_evali]);
                                return false;
                            }
                            break;
                        case "date":
                        case "mmddyy":
                        case "ddmmyy":
                        case "yymmdd":
                        case "mmddyyyy":
                            var _type = (_valtype == "date" || _valtype == "mmddyy") ? 1 : (_valtype == "ddmmyy") ? 2 : (_valtype == "yymmdd") ? 3 : (_valtype == "mmddyyyy") ? 4 : 0;
                            if (_type != 0) {
                                if (Validation.datevalidate(obj, _type) == false) {
                                    _type = (_valtype == "date" || _valtype == "mmddyy") ? "mm/dd/yy" : (_valtype == "ddmmyy") ? "dd/mm/yy" : (_valtype == "yymmdd") ? "yy/mm/dd" : (_valtype == "mmddyyyy") ? "mm/dd/yyyy" : "";
                                    Validation._errMessage = _arrval[_arrval.length - 1] + " " + Validation._errMessage.replace(/xxxx/, _type);
                                    return false;
                                }
                            }
                            break;
                        case "amt":
                        case "dbl":
                        case "double":
                        case "dbl3d":
                        case "dbl4d":
                            var _digit = (_valtype == "dbl3d") ? 3 : (_valtype == "dbl4d") ? 4 : 2;
                            if (Validation.IsDouble(obj, _digit) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + Validation._errMessage;
                                return false;
                            }
                            break;
                        case "num":
                        case "number":
                            if (Validation.isValid(Validation._nbr, obj.value) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$nbr;
                                return false;
                            }
                            break;
                        case "greaterthan":
                        case "graterthan":
                        case "gt":
                            _evali = _evali + 1;
                            var _grVal = _arrval[_evali];
                            if (parseInt(obj.value, 10) <= parseInt(_grVal, 10)) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$gt + " " + _grVal + ".";
                                return false;
                            }
                            break;
                        case "lessthan":
                        case "lt":
                            _evali = _evali + 1;
                            var _grVal = _arrval[_evali];
                            if (parseInt(obj.value, 10) > parseInt(_grVal, 10)) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$max + " " + _grVal + ".";
                                return false;
                            }
                            break;
                        case "cmptocurdate":
                            if (Validation.CurrentDateCompare(obj, _arrval[_evali - 1].toLowerCase()) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$cmpdate;
                                return false;
                            }
                            break;
                        case "ext":
                            _evali = _evali + 1;
                            if (Validation.Validateext(obj, _arrval[_evali]) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$filetype.replace(/xxxx/, _arrval[_evali].replace(/[.]/g, ','));
                                return false;
                            }
                            break;
                        case "pwd":
                            if (Validation.isAlphaNumeric(obj.value) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$pwd;
                                return false;
                            }
                            break;
                        case "alphanum":
                            if (Validation.isValid(Validation._nbr + Validation._lwr + Validation._uwr, obj.value) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$anbr;
                                return false;
                            }
                            break;
                        case "notstartwith":
                            _evali = _evali + 1;
                            var _len = _arrval[_evali].length;
                            if (_RTrim(obj.value).substring(0, _len).toLowerCase() == _arrval[_evali].toLowerCase()) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$notstartwith.replace(/xxxx/, _RTrim(obj.value).substring(0, _len));
                                return false;
                            }
                            break;
                        case "chkgrpreq":
                        case "rdbgrpreq":
                            _evali = _evali + 1; var _chkRdoObj = $('#' + obj.id);
                            if (!_chkRdoObj.hasClass(_arrval[_evali])) {
                                _chkRdoObj.addClass(_arrval[_evali]);
                            }
                            if (Validation.ValidateCheckBoxList($('.' + _arrval[_evali])) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1];
                                return false;
                            }
                            break;
                        case "visichkgrpreq":
                        case "visirdbgrpreq":
                            _evali = _evali + 1; var _chkRdoObj = $('#' + obj.id);
                            if (!_chkRdoObj.filter(':visible').hasClass(_arrval[_evali])) {
                                _chkRdoObj.addClass(_arrval[_evali]);
                            }
                            if (Validation.ValidateCheckBoxList($('.' + _arrval[_evali]).filter(':visible')) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1];
                                return false;
                            }
                            break;
                        case "filegrpreq":
                            _evali += 1; var _fileObj = $('#' + obj.id);
                            if (!_fileObj.hasClass(_arrval[_evali])) {
                                _fileObj.addClass(_arrval[_evali]);
                            }
                            if (Validation.ValidateFilesList($('.' + _arrval[_evali])) == false) {
                                Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$required;
                                return false;
                            }
                            break;
                        case "txtgrpreq":
                            _evali = _evali + 1;
                            var blnAllow = false;
                            $("." + _arrval[_evali]).each(function () {
                                if (Validation.RequiredValidate(this)) {
                                    blnAllow = true;
                                }
                            });
                            if (!blnAllow) {
                                Validation._errMessage = _arrval[_arrval.length - 1];
                                return false;
                            }
                            break;
                        case "datepattern":
                            if (_$obj.filter(":visible").length > 0) {
                                if (Validation.IsDatePattern(obj) == false) {
                                    Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$dtptt;
                                    return false;
                                }
                            }
                            break;
                        case "timepattern":
                            if (_$obj.filter(":visible").length > 0) {
                                if (Validation.IsTimePattern(obj) == false) {
                                    Validation._errMessage = _arrval[_arrval.length - 1] + " " + _$dtptt;
                                    return false;
                                }
                            }
                            break;
                        case "methodreq":
                        case "mreq":
                            _evali = _evali + 1;
                            var _Val = _arrval[_evali];
                            _Val = eval(_Val);
                            if (!_Val) {
                                Validation._errMessage = _arrval[_arrval.length - 1];
                                return false;
                            }
                            break;
                    }
                }
                return true;
            }
        }
    }
    this.isValid = function (key, val) {
        var parm = val;
        for (i = 0; i < parm.length; i++) { if (key.indexOf(parm.charAt(i), 0) == -1) { return false; } }
        return true;
    }
    this.RequiredValidate = function (obj) {
        var _trimVal = _RTrim(obj.value);
        switch (obj.type) {
            case "text":
            case "password":
            case "file":
            case "textarea":
                if (_trimVal == "") { return false; }
                break;
            case "select-one":
                if (_trimVal == "" || _trimVal == "-1" || _trimVal == "0") { return false; }
                break;
            case "checkbox":
                if (obj.checked == false) { return false; }
                break;
        }
        return true;
    }
    this.IsDatePattern = function (obj) {
        return Validation.isValid("dMy ,-/", obj.value);
    }
    this.IsTimePattern = function (obj) {
        return Validation.isValid("hHmst :", obj.value);
    }
    this.Validateext = function (obj, _type) {
        var _fval = _RTrim(obj.value).toLowerCase();
        var arr_strType = new Array();
        _type = _type.toLowerCase();
        arr_strType = _fval.split('.');
        if (arr_strType.length <= 1) { return false; }
        _fval = arr_strType[arr_strType.length - 1];
        if (_type.indexOf(_fval, 0) == -1) { return false; }
        return true;
    }
    this.CurrentDateCompare = function (obj, type) {
        if (_RTrim(obj.value) == "") { return true; }
        var ADate = _RTrim(obj.value);
        var arrDate = new Array();
        arrDate = ADate.split('/');
        if (type == "mmddyy") { var month = arrDate[0]; var day = arrDate[1]; var year = "20" + arrDate[2]; }
        else if (type == "ddmmyy") { var month = arrDate[1]; var day = arrDate[0]; var year = "20" + arrDate[2]; }
        else if (type == "yymmdd") { var month = arrDate[1]; var day = arrDate[2]; var year = "20" + arrDate[0]; }
        ADate = month + "/" + day + "/" + year;
        var _curdate = new Date(Validation._$currentdate);
        var _actdate = new Date(ADate);
        if (_curdate < _actdate) { return false; }
        return true;
    }
    this.IsDouble = function (obj, digit) {
        if (digit == undefined) { digit = 2; }
        if (_RTrim(obj.value) == "") { return true; }
        if (Validation.isValid(Validation._nbr + ".", obj.value) == false) { Validation._errMessage = _$number; return false; }
        var arr = new Array(); arr = _RTrim(obj.value).split('.');
        if (arr.length > 2) { Validation._errMessage = " is in incorrect format. The decimal values should not be more than " + digit + " digits."; return false; }
        else { if (arr.length == 2) { if (arr[1].length > digit) { Validation._errMessage = " is in incorrect format. The decimal values should not be more than " + digit + " digits."; return false; } } }
        return true;
    }
    this.isUrl = function (s) { return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(s); }
    this.isWWWUrl = function (s) { return /^www.*/i.test(s); }
    this.isCusUrl = function (s) {
        var iResult = Validation.isUrl(s);
        if (iResult == false) {
            iResult = Validation.isWWWUrl(s);
            if (iResult == false) {
                iResult = /^\//.test(s);
            }
        }
        return iResult;
    }
    this.EmailValidation = function (obj) {
        var _pattern = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        var _inputval = _RTrim(obj.value);
        if (_pattern.test(_inputval) || _inputval == "") { return true; }
        else { return false; }
    }
    this.isAlphaNumeric = function (val) {
        var parm = val;
        var key1 = Validation._nbr;
        var key2 = Validation._lwr + Validation._uwr; var isChar = false; var isNum = false;
        for (i = 0; i < parm.length; i++) {
            if (key1.indexOf(parm.charAt(i), 0) == -1) {
                isChar = true;
                if (key2.indexOf(parm.charAt(i), 0) == -1) {
                    return false;
                }
            }
            else {
                isNum = true;
            }
        }
        if (isChar == true && isNum == true) { return true; }
        else { return false; }
    }
    this.datevalidate = function (obj, type) {
        if (_RTrim(obj.value) == "") { return true; }
        var ADate = _RTrim(obj.value);
        var arrDate = new Array();
        arrDate = ADate.split('/');
        if (arrDate.length != 3) { Validation._errMessage = _$date; return false; }
        if (type == 2) {
            if (arrDate[0].length > 2 || arrDate[1].length > 2 || arrDate[2].length > 2) { Validation._errMessage = _$date; return false; }
        }
        else if (type == 4) {
            if (arrDate[0].length > 2 || arrDate[1].length > 2 || arrDate[2].length > 4) { Validation._errMessage = _$date; return false; }
        }
        if (type == 1) { var month = arrDate[0]; var day = arrDate[1]; var year = "20" + arrDate[2]; }
        else if (type == 2) { var month = arrDate[1]; var day = arrDate[0]; var year = "20" + arrDate[2]; }
        else if (type == 3) { var month = arrDate[1]; var day = arrDate[2]; var year = "20" + arrDate[0]; }
        else if (type == 4) { var month = arrDate[0]; var day = arrDate[1]; var year = "20" + arrDate[2]; }
        ADate = month + "/" + day + "/" + year;
        if (Validation.isValid(Validation._nbr, day) == false) { Validation._errMessage = _$ndateday; return false; }
        if (Validation.isValid(Validation._nbr, month) == false) { Validation._errMessage = _$ndatemon; return false; }
        if (Validation.isValid(Validation._nbr, year) == false) { Validation._errMessage = _$ndateyr; return false; }
        var NDate = new Date(ADate);
        if (NDate.getDate() != day) { Validation._errMessage = _$dateday; return (false); }
        else if (NDate.getMonth() != month - 1) { Validation._errMessage = _$datemon; return (false); }
        else if (NDate.getFullYear() != year) { Validation._errMessage = _$dateyr; return (false); }
        return true;
    }
    this.ValidateCheckBoxList = function (_cblObj) {
        var _isValidCheck = _cblObj.length > 0 ? false : true;
        if (!_isValidCheck) {
            _isValidCheck = (_cblObj.filter(":" + _cblObj[0].type + ":checked").length > 0) ? true : false;
        }
        return _isValidCheck;
    }
    this.ValidateFilesList = function (_cblObj) {
        var isFileAvil = _cblObj.length > 0 ? false : true;
        if (!isFileAvil) {
            isFileAvil = (_cblObj.filter("[type=" + _cblObj[0].type + "][value!='']").length > 0) ? true : false;
        }
        return isFileAvil;
    }
    this.GetScreenCordinates = function(obj) {
		var p = {};
		p.x = obj.offsetLeft;
		p.y = obj.offsetTop;
		while (obj.offsetParent) {
			p.x = p.x + obj.offsetParent.offsetLeft;
			p.y = p.y + obj.offsetParent.offsetTop;
			if (obj == document.getElementsByTagName("body")[0]) {
				break;
			}
			else {
				obj = obj.offsetParent;
			}
		}
		return p;
	}
}
function RValidate(id, msg) { var obj = $("#" + id)[0]; if (Validation.RequiredValidate(obj) == false) { jAlert(msg, "Alert Message"); return false; } return true; }
function _RTrim(Val) { return Val.replace(/\s+$/, ""); }
function ValCallBack() { HideAlertPopup(); }

var _$required = "is required.";
var _$requiredsel = "field is required. Please choose from the dropdown list.";
var _$requiredchk = "is a required field. Please select it.";
var _$email = "Please enter a valid email address. For example: user@domain.com";
var _$url = "is not having valid url.";
var _$emailfmt = "is in the incorrect format. Please enter a valid email address.";
var _$date = "is in incorrect date format. The date format should be: xxxx";
var _$ddmm = "is in incorrect format. The format should be: dd/mm";
var _$filetype = "is in incorrect file type. The file type should be: (xxxx)";
var _$postcode = "is in incorrect format. Please enter a valid UK postcode";
var _$dateday = "is a invalid Date. Please enter the valid day.";
var _$ndateday = "is a invalid Date. Day should be a numeric field.";
var _$datemon = "is a invalid Date. Please enter the valid month.";
var _$ndatemon = "is a invalid Date. Month should be a numeric field.";
var _$dateyr = "is a invalid Date. Please enter the valid year.";
var _$ndateyr = "is a invalid Date. Year should be a numeric field.";
var _$cmpdate = "should be today or earlier.";
var _$number = "should be a numeric field.";
var _$nbr = "is in the incorrect format. The format should be a number.";
var _$pwd = "should contain atleast one number and alphabet.";
var _$anbr = "should be a alphanumeric.";
var _$double = "is in the incorrect format. The format should be a '#.##' or '##.##' or '###.##'...";
var _$double3d = "is in the incorrect format. The format should be a '#.##' or '#.###' or '##.##' or '##.###'...";
var _$double4d = "is in the incorrect format. The format should be a '#.##' or '#.###' or '##.##' or '##.####'...";
var _$creditcard = "Please enter a valid credit card number.";
var _$equalTo = "";
var _$range = "";
var _$max = "should be less than or equal to ";
var _$min = "Please enter a value greater than or equal to ";
var _$mincl = "should have atleast xxxx characters.";
var _$maxcl = "should be less than xxxx character.";
var _$eqcl = "should be xxxx character.";
var _$emailcmp = "Emails do not match";
var _$pwdcmp = "Passwords do not match";
var _$gt = "should be greater than";
var _$dtptt = "input string is not in a correct format";
var _$session = "Your session has expired after a period of inactivity or is no longer valid.<br/>Please try again.";
var _$sessionhead = "Session Expired";
var _$notstartwith = "can not starts with 'xxxx'";
var _$gtz = "should be greater than 0";
var _$sortc = "Sort code is not valid";
