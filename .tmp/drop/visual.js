/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
                var DataViewTransform;
                (function (DataViewTransform) {
                    // TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
                    function createValueColumns(values, valueIdentityFields, source) {
                        if (values === void 0) { values = []; }
                        var result = values;
                        setGrouped(result);
                        if (valueIdentityFields) {
                            result.identityFields = valueIdentityFields;
                        }
                        if (source) {
                            result.source = source;
                        }
                        return result;
                    }
                    DataViewTransform.createValueColumns = createValueColumns;
                    function setGrouped(values, groupedResult) {
                        values.grouped = groupedResult
                            ? function () { return groupedResult; }
                            : function () { return groupValues(values); };
                    }
                    DataViewTransform.setGrouped = setGrouped;
                    /** Group together the values with a common identity. */
                    function groupValues(values) {
                        var groups = [], currentGroup;
                        for (var i = 0, len = values.length; i < len; i++) {
                            var value = values[i];
                            if (!currentGroup || currentGroup.identity !== value.identity) {
                                currentGroup = {
                                    values: []
                                };
                                if (value.identity) {
                                    currentGroup.identity = value.identity;
                                    var source = value.source;
                                    // allow null, which will be formatted as (Blank).
                                    if (source.groupName !== undefined) {
                                        currentGroup.name = source.groupName;
                                    }
                                    else if (source.displayName) {
                                        currentGroup.name = source.displayName;
                                    }
                                }
                                groups.push(currentGroup);
                            }
                            currentGroup.values.push(value);
                        }
                        return groups;
                    }
                    DataViewTransform.groupValues = groupValues;
                })(DataViewTransform = dataview.DataViewTransform || (dataview.DataViewTransform = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataRoleHelper;
                (function (DataRoleHelper) {
                    function getMeasureIndexOfRole(grouped, roleName) {
                        if (!grouped || !grouped.length) {
                            return -1;
                        }
                        var firstGroup = grouped[0];
                        if (firstGroup.values && firstGroup.values.length > 0) {
                            for (var i = 0, len = firstGroup.values.length; i < len; ++i) {
                                var value = firstGroup.values[i];
                                if (value && value.source) {
                                    if (hasRole(value.source, roleName)) {
                                        return i;
                                    }
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getMeasureIndexOfRole = getMeasureIndexOfRole;
                    function getCategoryIndexOfRole(categories, roleName) {
                        if (categories && categories.length) {
                            for (var i = 0, ilen = categories.length; i < ilen; i++) {
                                if (hasRole(categories[i].source, roleName)) {
                                    return i;
                                }
                            }
                        }
                        return -1;
                    }
                    DataRoleHelper.getCategoryIndexOfRole = getCategoryIndexOfRole;
                    function hasRole(column, name) {
                        var roles = column.roles;
                        return roles && roles[name];
                    }
                    DataRoleHelper.hasRole = hasRole;
                    function hasRoleInDataView(dataView, name) {
                        return dataView != null
                            && dataView.metadata != null
                            && dataView.metadata.columns
                            && dataView.metadata.columns.some(function (c) { return c.roles && c.roles[name] !== undefined; }); // any is an alias of some
                    }
                    DataRoleHelper.hasRoleInDataView = hasRoleInDataView;
                    function hasRoleInValueColumn(valueColumn, name) {
                        return valueColumn
                            && valueColumn.source
                            && valueColumn.source.roles
                            && (valueColumn.source.roles[name] === true);
                    }
                    DataRoleHelper.hasRoleInValueColumn = hasRoleInValueColumn;
                })(DataRoleHelper = dataview.DataRoleHelper || (dataview.DataRoleHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObject;
                (function (DataViewObject) {
                    function getValue(object, propertyName, defaultValue) {
                        if (!object) {
                            return defaultValue;
                        }
                        var propertyValue = object[propertyName];
                        if (propertyValue === undefined) {
                            return defaultValue;
                        }
                        return propertyValue;
                    }
                    DataViewObject.getValue = getValue;
                    /** Gets the solid color from a fill property using only a propertyName */
                    function getFillColorByPropertyName(object, propertyName, defaultColor) {
                        var value = getValue(object, propertyName);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObject.getFillColorByPropertyName = getFillColorByPropertyName;
                })(DataViewObject = dataview.DataViewObject || (dataview.DataViewObject = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjects;
                (function (DataViewObjects) {
                    /** Gets the value of the given object/property pair. */
                    function getValue(objects, propertyId, defaultValue) {
                        if (!objects) {
                            return defaultValue;
                        }
                        return dataview.DataViewObject.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
                    }
                    DataViewObjects.getValue = getValue;
                    /** Gets an object from objects. */
                    function getObject(objects, objectName, defaultValue) {
                        if (objects && objects[objectName]) {
                            return objects[objectName];
                        }
                        return defaultValue;
                    }
                    DataViewObjects.getObject = getObject;
                    /** Gets the solid color from a fill property. */
                    function getFillColor(objects, propertyId, defaultColor) {
                        var value = getValue(objects, propertyId);
                        if (!value || !value.solid) {
                            return defaultColor;
                        }
                        return value.solid.color;
                    }
                    DataViewObjects.getFillColor = getFillColor;
                    function getCommonValue(objects, propertyId, defaultValue) {
                        var value = getValue(objects, propertyId, defaultValue);
                        if (value && value.solid) {
                            return value.solid.color;
                        }
                        if (value === undefined
                            || value === null
                            || (typeof value === "object" && !value.solid)) {
                            return defaultValue;
                        }
                        return value;
                    }
                    DataViewObjects.getCommonValue = getCommonValue;
                })(DataViewObjects = dataview.DataViewObjects || (dataview.DataViewObjects = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                // powerbi.extensibility.utils.dataview
                var DataRoleHelper = powerbi.extensibility.utils.dataview.DataRoleHelper;
                var converterHelper;
                (function (converterHelper) {
                    function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
                        if (dataView.categories && dataView.categories.length > 0) {
                            // Need to pivot data if our category soure is a series role
                            var category = dataView.categories[0];
                            return category.source &&
                                DataRoleHelper.hasRole(category.source, seriesRoleName) &&
                                DataRoleHelper.hasRole(category.source, categoryRoleName);
                        }
                        return false;
                    }
                    converterHelper.categoryIsAlsoSeriesRole = categoryIsAlsoSeriesRole;
                    function getSeriesName(source) {
                        return (source.groupName !== undefined)
                            ? source.groupName
                            : source.queryName;
                    }
                    converterHelper.getSeriesName = getSeriesName;
                    function isImageUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.imageUrl === true;
                    }
                    converterHelper.isImageUrlColumn = isImageUrlColumn;
                    function isWebUrlColumn(column) {
                        var misc = getMiscellaneousTypeDescriptor(column);
                        return misc != null && misc.webUrl === true;
                    }
                    converterHelper.isWebUrlColumn = isWebUrlColumn;
                    function getMiscellaneousTypeDescriptor(column) {
                        return column
                            && column.type
                            && column.type.misc;
                    }
                    converterHelper.getMiscellaneousTypeDescriptor = getMiscellaneousTypeDescriptor;
                    function hasImageUrlColumn(dataView) {
                        if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
                            return false;
                        }
                        return dataView.metadata.columns.some(function (column) { return isImageUrlColumn(column) === true; });
                    }
                    converterHelper.hasImageUrlColumn = hasImageUrlColumn;
                })(converterHelper = dataview.converterHelper || (dataview.converterHelper = {}));
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var utils;
        (function (utils) {
            var dataview;
            (function (dataview) {
                var DataViewObjectsParser = (function () {
                    function DataViewObjectsParser() {
                    }
                    DataViewObjectsParser.getDefault = function () {
                        return new this();
                    };
                    DataViewObjectsParser.createPropertyIdentifier = function (objectName, propertyName) {
                        return {
                            objectName: objectName,
                            propertyName: propertyName
                        };
                    };
                    DataViewObjectsParser.parse = function (dataView) {
                        var dataViewObjectParser = this.getDefault(), properties;
                        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
                            return dataViewObjectParser;
                        }
                        properties = dataViewObjectParser.getProperties();
                        for (var objectName in properties) {
                            for (var propertyName in properties[objectName]) {
                                var defaultValue = dataViewObjectParser[objectName][propertyName];
                                dataViewObjectParser[objectName][propertyName] = dataview.DataViewObjects.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
                            }
                        }
                        return dataViewObjectParser;
                    };
                    DataViewObjectsParser.isPropertyEnumerable = function (propertyName) {
                        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
                    };
                    DataViewObjectsParser.enumerateObjectInstances = function (dataViewObjectParser, options) {
                        var dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
                        if (!dataViewProperties) {
                            return [];
                        }
                        var instance = {
                            objectName: options.objectName,
                            selector: null,
                            properties: {}
                        };
                        for (var key in dataViewProperties) {
                            if (dataViewProperties.hasOwnProperty(key)) {
                                instance.properties[key] = dataViewProperties[key];
                            }
                        }
                        return {
                            instances: [instance]
                        };
                    };
                    DataViewObjectsParser.prototype.getProperties = function () {
                        var _this = this;
                        var properties = {}, objectNames = Object.keys(this);
                        objectNames.forEach(function (objectName) {
                            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                var propertyNames = Object.keys(_this[objectName]);
                                properties[objectName] = {};
                                propertyNames.forEach(function (propertyName) {
                                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                                        properties[objectName][propertyName] =
                                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                                    }
                                });
                            }
                        });
                        return properties;
                    };
                    return DataViewObjectsParser;
                }());
                DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
                dataview.DataViewObjectsParser = DataViewObjectsParser;
            })(dataview = utils.dataview || (utils.dataview = {}));
        })(utils = extensibility.utils || (extensibility.utils = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));

!function(){function n(n){return n&&(n.ownerDocument||n.document||n).documentElement}function t(n){return n&&(n.ownerDocument&&n.ownerDocument.defaultView||n.document&&n||n.defaultView)}function e(n,t){return t>n?-1:n>t?1:n>=t?0:NaN}function r(n){return null===n?NaN:+n}function i(n){return!isNaN(n)}function u(n){return{left:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;n(t[u],e)<0?r=u+1:i=u}return r},right:function(t,e,r,i){for(arguments.length<3&&(r=0),arguments.length<4&&(i=t.length);i>r;){var u=r+i>>>1;n(t[u],e)>0?i=u:r=u+1}return r}}}function o(n){return n.length}function a(n){for(var t=1;n*t%1;)t*=10;return t}function l(n,t){for(var e in t)Object.defineProperty(n.prototype,e,{value:t[e],enumerable:!1})}function c(){this._=Object.create(null)}function f(n){return(n+="")===bo||n[0]===_o?_o+n:n}function s(n){return(n+="")[0]===_o?n.slice(1):n}function h(n){return f(n)in this._}function p(n){return(n=f(n))in this._&&delete this._[n]}function g(){var n=[];for(var t in this._)n.push(s(t));return n}function v(){var n=0;for(var t in this._)++n;return n}function d(){for(var n in this._)return!1;return!0}function y(){this._=Object.create(null)}function m(n){return n}function M(n,t,e){return function(){var r=e.apply(t,arguments);return r===t?n:r}}function x(n,t){if(t in n)return t;t=t.charAt(0).toUpperCase()+t.slice(1);for(var e=0,r=wo.length;r>e;++e){var i=wo[e]+t;if(i in n)return i}}function b(){}function _(){}function w(n){function t(){for(var t,r=e,i=-1,u=r.length;++i<u;)(t=r[i].on)&&t.apply(this,arguments);return n}var e=[],r=new c;return t.on=function(t,i){var u,o=r.get(t);return arguments.length<2?o&&o.on:(o&&(o.on=null,e=e.slice(0,u=e.indexOf(o)).concat(e.slice(u+1)),r.remove(t)),i&&e.push(r.set(t,{on:i})),n)},t}function S(){ao.event.preventDefault()}function k(){for(var n,t=ao.event;n=t.sourceEvent;)t=n;return t}function N(n){for(var t=new _,e=0,r=arguments.length;++e<r;)t[arguments[e]]=w(t);return t.of=function(e,r){return function(i){try{var u=i.sourceEvent=ao.event;i.target=n,ao.event=i,t[i.type].apply(e,r)}finally{ao.event=u}}},t}function E(n){return ko(n,Co),n}function A(n){return"function"==typeof n?n:function(){return No(n,this)}}function C(n){return"function"==typeof n?n:function(){return Eo(n,this)}}function z(n,t){function e(){this.removeAttribute(n)}function r(){this.removeAttributeNS(n.space,n.local)}function i(){this.setAttribute(n,t)}function u(){this.setAttributeNS(n.space,n.local,t)}function o(){var e=t.apply(this,arguments);null==e?this.removeAttribute(n):this.setAttribute(n,e)}function a(){var e=t.apply(this,arguments);null==e?this.removeAttributeNS(n.space,n.local):this.setAttributeNS(n.space,n.local,e)}return n=ao.ns.qualify(n),null==t?n.local?r:e:"function"==typeof t?n.local?a:o:n.local?u:i}function L(n){return n.trim().replace(/\s+/g," ")}function q(n){return new RegExp("(?:^|\\s+)"+ao.requote(n)+"(?:\\s+|$)","g")}function T(n){return(n+"").trim().split(/^|\s+/)}function R(n,t){function e(){for(var e=-1;++e<i;)n[e](this,t)}function r(){for(var e=-1,r=t.apply(this,arguments);++e<i;)n[e](this,r)}n=T(n).map(D);var i=n.length;return"function"==typeof t?r:e}function D(n){var t=q(n);return function(e,r){if(i=e.classList)return r?i.add(n):i.remove(n);var i=e.getAttribute("class")||"";r?(t.lastIndex=0,t.test(i)||e.setAttribute("class",L(i+" "+n))):e.setAttribute("class",L(i.replace(t," ")))}}function P(n,t,e){function r(){this.style.removeProperty(n)}function i(){this.style.setProperty(n,t,e)}function u(){var r=t.apply(this,arguments);null==r?this.style.removeProperty(n):this.style.setProperty(n,r,e)}return null==t?r:"function"==typeof t?u:i}function U(n,t){function e(){delete this[n]}function r(){this[n]=t}function i(){var e=t.apply(this,arguments);null==e?delete this[n]:this[n]=e}return null==t?e:"function"==typeof t?i:r}function j(n){function t(){var t=this.ownerDocument,e=this.namespaceURI;return e===zo&&t.documentElement.namespaceURI===zo?t.createElement(n):t.createElementNS(e,n)}function e(){return this.ownerDocument.createElementNS(n.space,n.local)}return"function"==typeof n?n:(n=ao.ns.qualify(n)).local?e:t}function F(){var n=this.parentNode;n&&n.removeChild(this)}function H(n){return{__data__:n}}function O(n){return function(){return Ao(this,n)}}function I(n){return arguments.length||(n=e),function(t,e){return t&&e?n(t.__data__,e.__data__):!t-!e}}function Y(n,t){for(var e=0,r=n.length;r>e;e++)for(var i,u=n[e],o=0,a=u.length;a>o;o++)(i=u[o])&&t(i,o,e);return n}function Z(n){return ko(n,qo),n}function V(n){var t,e;return function(r,i,u){var o,a=n[u].update,l=a.length;for(u!=e&&(e=u,t=0),i>=t&&(t=i+1);!(o=a[t])&&++t<l;);return o}}function X(n,t,e){function r(){var t=this[o];t&&(this.removeEventListener(n,t,t.$),delete this[o])}function i(){var i=l(t,co(arguments));r.call(this),this.addEventListener(n,this[o]=i,i.$=e),i._=t}function u(){var t,e=new RegExp("^__on([^.]+)"+ao.requote(n)+"$");for(var r in this)if(t=r.match(e)){var i=this[r];this.removeEventListener(t[1],i,i.$),delete this[r]}}var o="__on"+n,a=n.indexOf("."),l=$;a>0&&(n=n.slice(0,a));var c=To.get(n);return c&&(n=c,l=B),a?t?i:r:t?b:u}function $(n,t){return function(e){var r=ao.event;ao.event=e,t[0]=this.__data__;try{n.apply(this,t)}finally{ao.event=r}}}function B(n,t){var e=$(n,t);return function(n){var t=this,r=n.relatedTarget;r&&(r===t||8&r.compareDocumentPosition(t))||e.call(t,n)}}function W(e){var r=".dragsuppress-"+ ++Do,i="click"+r,u=ao.select(t(e)).on("touchmove"+r,S).on("dragstart"+r,S).on("selectstart"+r,S);if(null==Ro&&(Ro="onselectstart"in e?!1:x(e.style,"userSelect")),Ro){var o=n(e).style,a=o[Ro];o[Ro]="none"}return function(n){if(u.on(r,null),Ro&&(o[Ro]=a),n){var t=function(){u.on(i,null)};u.on(i,function(){S(),t()},!0),setTimeout(t,0)}}}function J(n,e){e.changedTouches&&(e=e.changedTouches[0]);var r=n.ownerSVGElement||n;if(r.createSVGPoint){var i=r.createSVGPoint();if(0>Po){var u=t(n);if(u.scrollX||u.scrollY){r=ao.select("body").append("svg").style({position:"absolute",top:0,left:0,margin:0,padding:0,border:"none"},"important");var o=r[0][0].getScreenCTM();Po=!(o.f||o.e),r.remove()}}return Po?(i.x=e.pageX,i.y=e.pageY):(i.x=e.clientX,i.y=e.clientY),i=i.matrixTransform(n.getScreenCTM().inverse()),[i.x,i.y]}var a=n.getBoundingClientRect();return[e.clientX-a.left-n.clientLeft,e.clientY-a.top-n.clientTop]}function G(){return ao.event.changedTouches[0].identifier}function K(n){return n>0?1:0>n?-1:0}function Q(n,t,e){return(t[0]-n[0])*(e[1]-n[1])-(t[1]-n[1])*(e[0]-n[0])}function nn(n){return n>1?0:-1>n?Fo:Math.acos(n)}function tn(n){return n>1?Io:-1>n?-Io:Math.asin(n)}function en(n){return((n=Math.exp(n))-1/n)/2}function rn(n){return((n=Math.exp(n))+1/n)/2}function un(n){return((n=Math.exp(2*n))-1)/(n+1)}function on(n){return(n=Math.sin(n/2))*n}function an(){}function ln(n,t,e){return this instanceof ln?(this.h=+n,this.s=+t,void(this.l=+e)):arguments.length<2?n instanceof ln?new ln(n.h,n.s,n.l):_n(""+n,wn,ln):new ln(n,t,e)}function cn(n,t,e){function r(n){return n>360?n-=360:0>n&&(n+=360),60>n?u+(o-u)*n/60:180>n?o:240>n?u+(o-u)*(240-n)/60:u}function i(n){return Math.round(255*r(n))}var u,o;return n=isNaN(n)?0:(n%=360)<0?n+360:n,t=isNaN(t)?0:0>t?0:t>1?1:t,e=0>e?0:e>1?1:e,o=.5>=e?e*(1+t):e+t-e*t,u=2*e-o,new mn(i(n+120),i(n),i(n-120))}function fn(n,t,e){return this instanceof fn?(this.h=+n,this.c=+t,void(this.l=+e)):arguments.length<2?n instanceof fn?new fn(n.h,n.c,n.l):n instanceof hn?gn(n.l,n.a,n.b):gn((n=Sn((n=ao.rgb(n)).r,n.g,n.b)).l,n.a,n.b):new fn(n,t,e)}function sn(n,t,e){return isNaN(n)&&(n=0),isNaN(t)&&(t=0),new hn(e,Math.cos(n*=Yo)*t,Math.sin(n)*t)}function hn(n,t,e){return this instanceof hn?(this.l=+n,this.a=+t,void(this.b=+e)):arguments.length<2?n instanceof hn?new hn(n.l,n.a,n.b):n instanceof fn?sn(n.h,n.c,n.l):Sn((n=mn(n)).r,n.g,n.b):new hn(n,t,e)}function pn(n,t,e){var r=(n+16)/116,i=r+t/500,u=r-e/200;return i=vn(i)*na,r=vn(r)*ta,u=vn(u)*ea,new mn(yn(3.2404542*i-1.5371385*r-.4985314*u),yn(-.969266*i+1.8760108*r+.041556*u),yn(.0556434*i-.2040259*r+1.0572252*u))}function gn(n,t,e){return n>0?new fn(Math.atan2(e,t)*Zo,Math.sqrt(t*t+e*e),n):new fn(NaN,NaN,n)}function vn(n){return n>.206893034?n*n*n:(n-4/29)/7.787037}function dn(n){return n>.008856?Math.pow(n,1/3):7.787037*n+4/29}function yn(n){return Math.round(255*(.00304>=n?12.92*n:1.055*Math.pow(n,1/2.4)-.055))}function mn(n,t,e){return this instanceof mn?(this.r=~~n,this.g=~~t,void(this.b=~~e)):arguments.length<2?n instanceof mn?new mn(n.r,n.g,n.b):_n(""+n,mn,cn):new mn(n,t,e)}function Mn(n){return new mn(n>>16,n>>8&255,255&n)}function xn(n){return Mn(n)+""}function bn(n){return 16>n?"0"+Math.max(0,n).toString(16):Math.min(255,n).toString(16)}function _n(n,t,e){var r,i,u,o=0,a=0,l=0;if(r=/([a-z]+)\((.*)\)/.exec(n=n.toLowerCase()))switch(i=r[2].split(","),r[1]){case"hsl":return e(parseFloat(i[0]),parseFloat(i[1])/100,parseFloat(i[2])/100);case"rgb":return t(Nn(i[0]),Nn(i[1]),Nn(i[2]))}return(u=ua.get(n))?t(u.r,u.g,u.b):(null==n||"#"!==n.charAt(0)||isNaN(u=parseInt(n.slice(1),16))||(4===n.length?(o=(3840&u)>>4,o=o>>4|o,a=240&u,a=a>>4|a,l=15&u,l=l<<4|l):7===n.length&&(o=(16711680&u)>>16,a=(65280&u)>>8,l=255&u)),t(o,a,l))}function wn(n,t,e){var r,i,u=Math.min(n/=255,t/=255,e/=255),o=Math.max(n,t,e),a=o-u,l=(o+u)/2;return a?(i=.5>l?a/(o+u):a/(2-o-u),r=n==o?(t-e)/a+(e>t?6:0):t==o?(e-n)/a+2:(n-t)/a+4,r*=60):(r=NaN,i=l>0&&1>l?0:r),new ln(r,i,l)}function Sn(n,t,e){n=kn(n),t=kn(t),e=kn(e);var r=dn((.4124564*n+.3575761*t+.1804375*e)/na),i=dn((.2126729*n+.7151522*t+.072175*e)/ta),u=dn((.0193339*n+.119192*t+.9503041*e)/ea);return hn(116*i-16,500*(r-i),200*(i-u))}function kn(n){return(n/=255)<=.04045?n/12.92:Math.pow((n+.055)/1.055,2.4)}function Nn(n){var t=parseFloat(n);return"%"===n.charAt(n.length-1)?Math.round(2.55*t):t}function En(n){return"function"==typeof n?n:function(){return n}}function An(n){return function(t,e,r){return 2===arguments.length&&"function"==typeof e&&(r=e,e=null),Cn(t,e,n,r)}}function Cn(n,t,e,r){function i(){var n,t=l.status;if(!t&&Ln(l)||t>=200&&300>t||304===t){try{n=e.call(u,l)}catch(r){return void o.error.call(u,r)}o.load.call(u,n)}else o.error.call(u,l)}var u={},o=ao.dispatch("beforesend","progress","load","error"),a={},l=new XMLHttpRequest,c=null;return!this.XDomainRequest||"withCredentials"in l||!/^(http(s)?:)?\/\//.test(n)||(l=new XDomainRequest),"onload"in l?l.onload=l.onerror=i:l.onreadystatechange=function(){l.readyState>3&&i()},l.onprogress=function(n){var t=ao.event;ao.event=n;try{o.progress.call(u,l)}finally{ao.event=t}},u.header=function(n,t){return n=(n+"").toLowerCase(),arguments.length<2?a[n]:(null==t?delete a[n]:a[n]=t+"",u)},u.mimeType=function(n){return arguments.length?(t=null==n?null:n+"",u):t},u.responseType=function(n){return arguments.length?(c=n,u):c},u.response=function(n){return e=n,u},["get","post"].forEach(function(n){u[n]=function(){return u.send.apply(u,[n].concat(co(arguments)))}}),u.send=function(e,r,i){if(2===arguments.length&&"function"==typeof r&&(i=r,r=null),l.open(e,n,!0),null==t||"accept"in a||(a.accept=t+",*/*"),l.setRequestHeader)for(var f in a)l.setRequestHeader(f,a[f]);return null!=t&&l.overrideMimeType&&l.overrideMimeType(t),null!=c&&(l.responseType=c),null!=i&&u.on("error",i).on("load",function(n){i(null,n)}),o.beforesend.call(u,l),l.send(null==r?null:r),u},u.abort=function(){return l.abort(),u},ao.rebind(u,o,"on"),null==r?u:u.get(zn(r))}function zn(n){return 1===n.length?function(t,e){n(null==t?e:null)}:n}function Ln(n){var t=n.responseType;return t&&"text"!==t?n.response:n.responseText}function qn(n,t,e){var r=arguments.length;2>r&&(t=0),3>r&&(e=Date.now());var i=e+t,u={c:n,t:i,n:null};return aa?aa.n=u:oa=u,aa=u,la||(ca=clearTimeout(ca),la=1,fa(Tn)),u}function Tn(){var n=Rn(),t=Dn()-n;t>24?(isFinite(t)&&(clearTimeout(ca),ca=setTimeout(Tn,t)),la=0):(la=1,fa(Tn))}function Rn(){for(var n=Date.now(),t=oa;t;)n>=t.t&&t.c(n-t.t)&&(t.c=null),t=t.n;return n}function Dn(){for(var n,t=oa,e=1/0;t;)t.c?(t.t<e&&(e=t.t),t=(n=t).n):t=n?n.n=t.n:oa=t.n;return aa=n,e}function Pn(n,t){return t-(n?Math.ceil(Math.log(n)/Math.LN10):1)}function Un(n,t){var e=Math.pow(10,3*xo(8-t));return{scale:t>8?function(n){return n/e}:function(n){return n*e},symbol:n}}function jn(n){var t=n.decimal,e=n.thousands,r=n.grouping,i=n.currency,u=r&&e?function(n,t){for(var i=n.length,u=[],o=0,a=r[0],l=0;i>0&&a>0&&(l+a+1>t&&(a=Math.max(1,t-l)),u.push(n.substring(i-=a,i+a)),!((l+=a+1)>t));)a=r[o=(o+1)%r.length];return u.reverse().join(e)}:m;return function(n){var e=ha.exec(n),r=e[1]||" ",o=e[2]||">",a=e[3]||"-",l=e[4]||"",c=e[5],f=+e[6],s=e[7],h=e[8],p=e[9],g=1,v="",d="",y=!1,m=!0;switch(h&&(h=+h.substring(1)),(c||"0"===r&&"="===o)&&(c=r="0",o="="),p){case"n":s=!0,p="g";break;case"%":g=100,d="%",p="f";break;case"p":g=100,d="%",p="r";break;case"b":case"o":case"x":case"X":"#"===l&&(v="0"+p.toLowerCase());case"c":m=!1;case"d":y=!0,h=0;break;case"s":g=-1,p="r"}"$"===l&&(v=i[0],d=i[1]),"r"!=p||h||(p="g"),null!=h&&("g"==p?h=Math.max(1,Math.min(21,h)):"e"!=p&&"f"!=p||(h=Math.max(0,Math.min(20,h)))),p=pa.get(p)||Fn;var M=c&&s;return function(n){var e=d;if(y&&n%1)return"";var i=0>n||0===n&&0>1/n?(n=-n,"-"):"-"===a?"":a;if(0>g){var l=ao.formatPrefix(n,h);n=l.scale(n),e=l.symbol+d}else n*=g;n=p(n,h);var x,b,_=n.lastIndexOf(".");if(0>_){var w=m?n.lastIndexOf("e"):-1;0>w?(x=n,b=""):(x=n.substring(0,w),b=n.substring(w))}else x=n.substring(0,_),b=t+n.substring(_+1);!c&&s&&(x=u(x,1/0));var S=v.length+x.length+b.length+(M?0:i.length),k=f>S?new Array(S=f-S+1).join(r):"";return M&&(x=u(k+x,k.length?f-b.length:1/0)),i+=v,n=x+b,("<"===o?i+n+k:">"===o?k+i+n:"^"===o?k.substring(0,S>>=1)+i+n+k.substring(S):i+(M?n:k+n))+e}}}function Fn(n){return n+""}function Hn(){this._=new Date(arguments.length>1?Date.UTC.apply(this,arguments):arguments[0])}function On(n,t,e){function r(t){var e=n(t),r=u(e,1);return r-t>t-e?e:r}function i(e){return t(e=n(new va(e-1)),1),e}function u(n,e){return t(n=new va(+n),e),n}function o(n,r,u){var o=i(n),a=[];if(u>1)for(;r>o;)e(o)%u||a.push(new Date(+o)),t(o,1);else for(;r>o;)a.push(new Date(+o)),t(o,1);return a}function a(n,t,e){try{va=Hn;var r=new Hn;return r._=n,o(r,t,e)}finally{va=Date}}n.floor=n,n.round=r,n.ceil=i,n.offset=u,n.range=o;var l=n.utc=In(n);return l.floor=l,l.round=In(r),l.ceil=In(i),l.offset=In(u),l.range=a,n}function In(n){return function(t,e){try{va=Hn;var r=new Hn;return r._=t,n(r,e)._}finally{va=Date}}}function Yn(n){function t(n){function t(t){for(var e,i,u,o=[],a=-1,l=0;++a<r;)37===n.charCodeAt(a)&&(o.push(n.slice(l,a)),null!=(i=ya[e=n.charAt(++a)])&&(e=n.charAt(++a)),(u=A[e])&&(e=u(t,null==i?"e"===e?" ":"0":i)),o.push(e),l=a+1);return o.push(n.slice(l,a)),o.join("")}var r=n.length;return t.parse=function(t){var r={y:1900,m:0,d:1,H:0,M:0,S:0,L:0,Z:null},i=e(r,n,t,0);if(i!=t.length)return null;"p"in r&&(r.H=r.H%12+12*r.p);var u=null!=r.Z&&va!==Hn,o=new(u?Hn:va);return"j"in r?o.setFullYear(r.y,0,r.j):"W"in r||"U"in r?("w"in r||(r.w="W"in r?1:0),o.setFullYear(r.y,0,1),o.setFullYear(r.y,0,"W"in r?(r.w+6)%7+7*r.W-(o.getDay()+5)%7:r.w+7*r.U-(o.getDay()+6)%7)):o.setFullYear(r.y,r.m,r.d),o.setHours(r.H+(r.Z/100|0),r.M+r.Z%100,r.S,r.L),u?o._:o},t.toString=function(){return n},t}function e(n,t,e,r){for(var i,u,o,a=0,l=t.length,c=e.length;l>a;){if(r>=c)return-1;if(i=t.charCodeAt(a++),37===i){if(o=t.charAt(a++),u=C[o in ya?t.charAt(a++):o],!u||(r=u(n,e,r))<0)return-1}else if(i!=e.charCodeAt(r++))return-1}return r}function r(n,t,e){_.lastIndex=0;var r=_.exec(t.slice(e));return r?(n.w=w.get(r[0].toLowerCase()),e+r[0].length):-1}function i(n,t,e){x.lastIndex=0;var r=x.exec(t.slice(e));return r?(n.w=b.get(r[0].toLowerCase()),e+r[0].length):-1}function u(n,t,e){N.lastIndex=0;var r=N.exec(t.slice(e));return r?(n.m=E.get(r[0].toLowerCase()),e+r[0].length):-1}function o(n,t,e){S.lastIndex=0;var r=S.exec(t.slice(e));return r?(n.m=k.get(r[0].toLowerCase()),e+r[0].length):-1}function a(n,t,r){return e(n,A.c.toString(),t,r)}function l(n,t,r){return e(n,A.x.toString(),t,r)}function c(n,t,r){return e(n,A.X.toString(),t,r)}function f(n,t,e){var r=M.get(t.slice(e,e+=2).toLowerCase());return null==r?-1:(n.p=r,e)}var s=n.dateTime,h=n.date,p=n.time,g=n.periods,v=n.days,d=n.shortDays,y=n.months,m=n.shortMonths;t.utc=function(n){function e(n){try{va=Hn;var t=new va;return t._=n,r(t)}finally{va=Date}}var r=t(n);return e.parse=function(n){try{va=Hn;var t=r.parse(n);return t&&t._}finally{va=Date}},e.toString=r.toString,e},t.multi=t.utc.multi=ct;var M=ao.map(),x=Vn(v),b=Xn(v),_=Vn(d),w=Xn(d),S=Vn(y),k=Xn(y),N=Vn(m),E=Xn(m);g.forEach(function(n,t){M.set(n.toLowerCase(),t)});var A={a:function(n){return d[n.getDay()]},A:function(n){return v[n.getDay()]},b:function(n){return m[n.getMonth()]},B:function(n){return y[n.getMonth()]},c:t(s),d:function(n,t){return Zn(n.getDate(),t,2)},e:function(n,t){return Zn(n.getDate(),t,2)},H:function(n,t){return Zn(n.getHours(),t,2)},I:function(n,t){return Zn(n.getHours()%12||12,t,2)},j:function(n,t){return Zn(1+ga.dayOfYear(n),t,3)},L:function(n,t){return Zn(n.getMilliseconds(),t,3)},m:function(n,t){return Zn(n.getMonth()+1,t,2)},M:function(n,t){return Zn(n.getMinutes(),t,2)},p:function(n){return g[+(n.getHours()>=12)]},S:function(n,t){return Zn(n.getSeconds(),t,2)},U:function(n,t){return Zn(ga.sundayOfYear(n),t,2)},w:function(n){return n.getDay()},W:function(n,t){return Zn(ga.mondayOfYear(n),t,2)},x:t(h),X:t(p),y:function(n,t){return Zn(n.getFullYear()%100,t,2)},Y:function(n,t){return Zn(n.getFullYear()%1e4,t,4)},Z:at,"%":function(){return"%"}},C={a:r,A:i,b:u,B:o,c:a,d:tt,e:tt,H:rt,I:rt,j:et,L:ot,m:nt,M:it,p:f,S:ut,U:Bn,w:$n,W:Wn,x:l,X:c,y:Gn,Y:Jn,Z:Kn,"%":lt};return t}function Zn(n,t,e){var r=0>n?"-":"",i=(r?-n:n)+"",u=i.length;return r+(e>u?new Array(e-u+1).join(t)+i:i)}function Vn(n){return new RegExp("^(?:"+n.map(ao.requote).join("|")+")","i")}function Xn(n){for(var t=new c,e=-1,r=n.length;++e<r;)t.set(n[e].toLowerCase(),e);return t}function $n(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+1));return r?(n.w=+r[0],e+r[0].length):-1}function Bn(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e));return r?(n.U=+r[0],e+r[0].length):-1}function Wn(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e));return r?(n.W=+r[0],e+r[0].length):-1}function Jn(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+4));return r?(n.y=+r[0],e+r[0].length):-1}function Gn(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+2));return r?(n.y=Qn(+r[0]),e+r[0].length):-1}function Kn(n,t,e){return/^[+-]\d{4}$/.test(t=t.slice(e,e+5))?(n.Z=-t,e+5):-1}function Qn(n){return n+(n>68?1900:2e3)}function nt(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+2));return r?(n.m=r[0]-1,e+r[0].length):-1}function tt(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+2));return r?(n.d=+r[0],e+r[0].length):-1}function et(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+3));return r?(n.j=+r[0],e+r[0].length):-1}function rt(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+2));return r?(n.H=+r[0],e+r[0].length):-1}function it(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+2));return r?(n.M=+r[0],e+r[0].length):-1}function ut(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+2));return r?(n.S=+r[0],e+r[0].length):-1}function ot(n,t,e){ma.lastIndex=0;var r=ma.exec(t.slice(e,e+3));return r?(n.L=+r[0],e+r[0].length):-1}function at(n){var t=n.getTimezoneOffset(),e=t>0?"-":"+",r=xo(t)/60|0,i=xo(t)%60;return e+Zn(r,"0",2)+Zn(i,"0",2)}function lt(n,t,e){Ma.lastIndex=0;var r=Ma.exec(t.slice(e,e+1));return r?e+r[0].length:-1}function ct(n){for(var t=n.length,e=-1;++e<t;)n[e][0]=this(n[e][0]);return function(t){for(var e=0,r=n[e];!r[1](t);)r=n[++e];return r[0](t)}}function ft(){}function st(n,t,e){var r=e.s=n+t,i=r-n,u=r-i;e.t=n-u+(t-i)}function ht(n,t){n&&wa.hasOwnProperty(n.type)&&wa[n.type](n,t)}function pt(n,t,e){var r,i=-1,u=n.length-e;for(t.lineStart();++i<u;)r=n[i],t.point(r[0],r[1],r[2]);t.lineEnd()}function gt(n,t){var e=-1,r=n.length;for(t.polygonStart();++e<r;)pt(n[e],t,1);t.polygonEnd()}function vt(){function n(n,t){n*=Yo,t=t*Yo/2+Fo/4;var e=n-r,o=e>=0?1:-1,a=o*e,l=Math.cos(t),c=Math.sin(t),f=u*c,s=i*l+f*Math.cos(a),h=f*o*Math.sin(a);ka.add(Math.atan2(h,s)),r=n,i=l,u=c}var t,e,r,i,u;Na.point=function(o,a){Na.point=n,r=(t=o)*Yo,i=Math.cos(a=(e=a)*Yo/2+Fo/4),u=Math.sin(a)},Na.lineEnd=function(){n(t,e)}}function dt(n){var t=n[0],e=n[1],r=Math.cos(e);return[r*Math.cos(t),r*Math.sin(t),Math.sin(e)]}function yt(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]}function mt(n,t){return[n[1]*t[2]-n[2]*t[1],n[2]*t[0]-n[0]*t[2],n[0]*t[1]-n[1]*t[0]]}function Mt(n,t){n[0]+=t[0],n[1]+=t[1],n[2]+=t[2]}function xt(n,t){return[n[0]*t,n[1]*t,n[2]*t]}function bt(n){var t=Math.sqrt(n[0]*n[0]+n[1]*n[1]+n[2]*n[2]);n[0]/=t,n[1]/=t,n[2]/=t}function _t(n){return[Math.atan2(n[1],n[0]),tn(n[2])]}function wt(n,t){return xo(n[0]-t[0])<Uo&&xo(n[1]-t[1])<Uo}function St(n,t){n*=Yo;var e=Math.cos(t*=Yo);kt(e*Math.cos(n),e*Math.sin(n),Math.sin(t))}function kt(n,t,e){++Ea,Ca+=(n-Ca)/Ea,za+=(t-za)/Ea,La+=(e-La)/Ea}function Nt(){function n(n,i){n*=Yo;var u=Math.cos(i*=Yo),o=u*Math.cos(n),a=u*Math.sin(n),l=Math.sin(i),c=Math.atan2(Math.sqrt((c=e*l-r*a)*c+(c=r*o-t*l)*c+(c=t*a-e*o)*c),t*o+e*a+r*l);Aa+=c,qa+=c*(t+(t=o)),Ta+=c*(e+(e=a)),Ra+=c*(r+(r=l)),kt(t,e,r)}var t,e,r;ja.point=function(i,u){i*=Yo;var o=Math.cos(u*=Yo);t=o*Math.cos(i),e=o*Math.sin(i),r=Math.sin(u),ja.point=n,kt(t,e,r)}}function Et(){ja.point=St}function At(){function n(n,t){n*=Yo;var e=Math.cos(t*=Yo),o=e*Math.cos(n),a=e*Math.sin(n),l=Math.sin(t),c=i*l-u*a,f=u*o-r*l,s=r*a-i*o,h=Math.sqrt(c*c+f*f+s*s),p=r*o+i*a+u*l,g=h&&-nn(p)/h,v=Math.atan2(h,p);Da+=g*c,Pa+=g*f,Ua+=g*s,Aa+=v,qa+=v*(r+(r=o)),Ta+=v*(i+(i=a)),Ra+=v*(u+(u=l)),kt(r,i,u)}var t,e,r,i,u;ja.point=function(o,a){t=o,e=a,ja.point=n,o*=Yo;var l=Math.cos(a*=Yo);r=l*Math.cos(o),i=l*Math.sin(o),u=Math.sin(a),kt(r,i,u)},ja.lineEnd=function(){n(t,e),ja.lineEnd=Et,ja.point=St}}function Ct(n,t){function e(e,r){return e=n(e,r),t(e[0],e[1])}return n.invert&&t.invert&&(e.invert=function(e,r){return e=t.invert(e,r),e&&n.invert(e[0],e[1])}),e}function zt(){return!0}function Lt(n,t,e,r,i){var u=[],o=[];if(n.forEach(function(n){if(!((t=n.length-1)<=0)){var t,e=n[0],r=n[t];if(wt(e,r)){i.lineStart();for(var a=0;t>a;++a)i.point((e=n[a])[0],e[1]);return void i.lineEnd()}var l=new Tt(e,n,null,!0),c=new Tt(e,null,l,!1);l.o=c,u.push(l),o.push(c),l=new Tt(r,n,null,!1),c=new Tt(r,null,l,!0),l.o=c,u.push(l),o.push(c)}}),o.sort(t),qt(u),qt(o),u.length){for(var a=0,l=e,c=o.length;c>a;++a)o[a].e=l=!l;for(var f,s,h=u[0];;){for(var p=h,g=!0;p.v;)if((p=p.n)===h)return;f=p.z,i.lineStart();do{if(p.v=p.o.v=!0,p.e){if(g)for(var a=0,c=f.length;c>a;++a)i.point((s=f[a])[0],s[1]);else r(p.x,p.n.x,1,i);p=p.n}else{if(g){f=p.p.z;for(var a=f.length-1;a>=0;--a)i.point((s=f[a])[0],s[1])}else r(p.x,p.p.x,-1,i);p=p.p}p=p.o,f=p.z,g=!g}while(!p.v);i.lineEnd()}}}function qt(n){if(t=n.length){for(var t,e,r=0,i=n[0];++r<t;)i.n=e=n[r],e.p=i,i=e;i.n=e=n[0],e.p=i}}function Tt(n,t,e,r){this.x=n,this.z=t,this.o=e,this.e=r,this.v=!1,this.n=this.p=null}function Rt(n,t,e,r){return function(i,u){function o(t,e){var r=i(t,e);n(t=r[0],e=r[1])&&u.point(t,e)}function a(n,t){var e=i(n,t);d.point(e[0],e[1])}function l(){m.point=a,d.lineStart()}function c(){m.point=o,d.lineEnd()}function f(n,t){v.push([n,t]);var e=i(n,t);x.point(e[0],e[1])}function s(){x.lineStart(),v=[]}function h(){f(v[0][0],v[0][1]),x.lineEnd();var n,t=x.clean(),e=M.buffer(),r=e.length;if(v.pop(),g.push(v),v=null,r)if(1&t){n=e[0];var i,r=n.length-1,o=-1;if(r>0){for(b||(u.polygonStart(),b=!0),u.lineStart();++o<r;)u.point((i=n[o])[0],i[1]);u.lineEnd()}}else r>1&&2&t&&e.push(e.pop().concat(e.shift())),p.push(e.filter(Dt))}var p,g,v,d=t(u),y=i.invert(r[0],r[1]),m={point:o,lineStart:l,lineEnd:c,polygonStart:function(){m.point=f,m.lineStart=s,m.lineEnd=h,p=[],g=[]},polygonEnd:function(){m.point=o,m.lineStart=l,m.lineEnd=c,p=ao.merge(p);var n=Ot(y,g);p.length?(b||(u.polygonStart(),b=!0),Lt(p,Ut,n,e,u)):n&&(b||(u.polygonStart(),b=!0),u.lineStart(),e(null,null,1,u),u.lineEnd()),b&&(u.polygonEnd(),b=!1),p=g=null},sphere:function(){u.polygonStart(),u.lineStart(),e(null,null,1,u),u.lineEnd(),u.polygonEnd()}},M=Pt(),x=t(M),b=!1;return m}}function Dt(n){return n.length>1}function Pt(){var n,t=[];return{lineStart:function(){t.push(n=[])},point:function(t,e){n.push([t,e])},lineEnd:b,buffer:function(){var e=t;return t=[],n=null,e},rejoin:function(){t.length>1&&t.push(t.pop().concat(t.shift()))}}}function Ut(n,t){return((n=n.x)[0]<0?n[1]-Io-Uo:Io-n[1])-((t=t.x)[0]<0?t[1]-Io-Uo:Io-t[1])}function jt(n){var t,e=NaN,r=NaN,i=NaN;return{lineStart:function(){n.lineStart(),t=1},point:function(u,o){var a=u>0?Fo:-Fo,l=xo(u-e);xo(l-Fo)<Uo?(n.point(e,r=(r+o)/2>0?Io:-Io),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(a,r),n.point(u,r),t=0):i!==a&&l>=Fo&&(xo(e-i)<Uo&&(e-=i*Uo),xo(u-a)<Uo&&(u-=a*Uo),r=Ft(e,r,u,o),n.point(i,r),n.lineEnd(),n.lineStart(),n.point(a,r),t=0),n.point(e=u,r=o),i=a},lineEnd:function(){n.lineEnd(),e=r=NaN},clean:function(){return 2-t}}}function Ft(n,t,e,r){var i,u,o=Math.sin(n-e);return xo(o)>Uo?Math.atan((Math.sin(t)*(u=Math.cos(r))*Math.sin(e)-Math.sin(r)*(i=Math.cos(t))*Math.sin(n))/(i*u*o)):(t+r)/2}function Ht(n,t,e,r){var i;if(null==n)i=e*Io,r.point(-Fo,i),r.point(0,i),r.point(Fo,i),r.point(Fo,0),r.point(Fo,-i),r.point(0,-i),r.point(-Fo,-i),r.point(-Fo,0),r.point(-Fo,i);else if(xo(n[0]-t[0])>Uo){var u=n[0]<t[0]?Fo:-Fo;i=e*u/2,r.point(-u,i),r.point(0,i),r.point(u,i)}else r.point(t[0],t[1])}function Ot(n,t){var e=n[0],r=n[1],i=[Math.sin(e),-Math.cos(e),0],u=0,o=0;ka.reset();for(var a=0,l=t.length;l>a;++a){var c=t[a],f=c.length;if(f)for(var s=c[0],h=s[0],p=s[1]/2+Fo/4,g=Math.sin(p),v=Math.cos(p),d=1;;){d===f&&(d=0),n=c[d];var y=n[0],m=n[1]/2+Fo/4,M=Math.sin(m),x=Math.cos(m),b=y-h,_=b>=0?1:-1,w=_*b,S=w>Fo,k=g*M;if(ka.add(Math.atan2(k*_*Math.sin(w),v*x+k*Math.cos(w))),u+=S?b+_*Ho:b,S^h>=e^y>=e){var N=mt(dt(s),dt(n));bt(N);var E=mt(i,N);bt(E);var A=(S^b>=0?-1:1)*tn(E[2]);(r>A||r===A&&(N[0]||N[1]))&&(o+=S^b>=0?1:-1)}if(!d++)break;h=y,g=M,v=x,s=n}}return(-Uo>u||Uo>u&&-Uo>ka)^1&o}function It(n){function t(n,t){return Math.cos(n)*Math.cos(t)>u}function e(n){var e,u,l,c,f;return{lineStart:function(){c=l=!1,f=1},point:function(s,h){var p,g=[s,h],v=t(s,h),d=o?v?0:i(s,h):v?i(s+(0>s?Fo:-Fo),h):0;if(!e&&(c=l=v)&&n.lineStart(),v!==l&&(p=r(e,g),(wt(e,p)||wt(g,p))&&(g[0]+=Uo,g[1]+=Uo,v=t(g[0],g[1]))),v!==l)f=0,v?(n.lineStart(),p=r(g,e),n.point(p[0],p[1])):(p=r(e,g),n.point(p[0],p[1]),n.lineEnd()),e=p;else if(a&&e&&o^v){var y;d&u||!(y=r(g,e,!0))||(f=0,o?(n.lineStart(),n.point(y[0][0],y[0][1]),n.point(y[1][0],y[1][1]),n.lineEnd()):(n.point(y[1][0],y[1][1]),n.lineEnd(),n.lineStart(),n.point(y[0][0],y[0][1])))}!v||e&&wt(e,g)||n.point(g[0],g[1]),e=g,l=v,u=d},lineEnd:function(){l&&n.lineEnd(),e=null},clean:function(){return f|(c&&l)<<1}}}function r(n,t,e){var r=dt(n),i=dt(t),o=[1,0,0],a=mt(r,i),l=yt(a,a),c=a[0],f=l-c*c;if(!f)return!e&&n;var s=u*l/f,h=-u*c/f,p=mt(o,a),g=xt(o,s),v=xt(a,h);Mt(g,v);var d=p,y=yt(g,d),m=yt(d,d),M=y*y-m*(yt(g,g)-1);if(!(0>M)){var x=Math.sqrt(M),b=xt(d,(-y-x)/m);if(Mt(b,g),b=_t(b),!e)return b;var _,w=n[0],S=t[0],k=n[1],N=t[1];w>S&&(_=w,w=S,S=_);var E=S-w,A=xo(E-Fo)<Uo,C=A||Uo>E;if(!A&&k>N&&(_=k,k=N,N=_),C?A?k+N>0^b[1]<(xo(b[0]-w)<Uo?k:N):k<=b[1]&&b[1]<=N:E>Fo^(w<=b[0]&&b[0]<=S)){var z=xt(d,(-y+x)/m);return Mt(z,g),[b,_t(z)]}}}function i(t,e){var r=o?n:Fo-n,i=0;return-r>t?i|=1:t>r&&(i|=2),-r>e?i|=4:e>r&&(i|=8),i}var u=Math.cos(n),o=u>0,a=xo(u)>Uo,l=ve(n,6*Yo);return Rt(t,e,l,o?[0,-n]:[-Fo,n-Fo])}function Yt(n,t,e,r){return function(i){var u,o=i.a,a=i.b,l=o.x,c=o.y,f=a.x,s=a.y,h=0,p=1,g=f-l,v=s-c;if(u=n-l,g||!(u>0)){if(u/=g,0>g){if(h>u)return;p>u&&(p=u)}else if(g>0){if(u>p)return;u>h&&(h=u)}if(u=e-l,g||!(0>u)){if(u/=g,0>g){if(u>p)return;u>h&&(h=u)}else if(g>0){if(h>u)return;p>u&&(p=u)}if(u=t-c,v||!(u>0)){if(u/=v,0>v){if(h>u)return;p>u&&(p=u)}else if(v>0){if(u>p)return;u>h&&(h=u)}if(u=r-c,v||!(0>u)){if(u/=v,0>v){if(u>p)return;u>h&&(h=u)}else if(v>0){if(h>u)return;p>u&&(p=u)}return h>0&&(i.a={x:l+h*g,y:c+h*v}),1>p&&(i.b={x:l+p*g,y:c+p*v}),i}}}}}}function Zt(n,t,e,r){function i(r,i){return xo(r[0]-n)<Uo?i>0?0:3:xo(r[0]-e)<Uo?i>0?2:1:xo(r[1]-t)<Uo?i>0?1:0:i>0?3:2}function u(n,t){return o(n.x,t.x)}function o(n,t){var e=i(n,1),r=i(t,1);return e!==r?e-r:0===e?t[1]-n[1]:1===e?n[0]-t[0]:2===e?n[1]-t[1]:t[0]-n[0]}return function(a){function l(n){for(var t=0,e=d.length,r=n[1],i=0;e>i;++i)for(var u,o=1,a=d[i],l=a.length,c=a[0];l>o;++o)u=a[o],c[1]<=r?u[1]>r&&Q(c,u,n)>0&&++t:u[1]<=r&&Q(c,u,n)<0&&--t,c=u;return 0!==t}function c(u,a,l,c){var f=0,s=0;if(null==u||(f=i(u,l))!==(s=i(a,l))||o(u,a)<0^l>0){do c.point(0===f||3===f?n:e,f>1?r:t);while((f=(f+l+4)%4)!==s)}else c.point(a[0],a[1])}function f(i,u){return i>=n&&e>=i&&u>=t&&r>=u}function s(n,t){f(n,t)&&a.point(n,t)}function h(){C.point=g,d&&d.push(y=[]),S=!0,w=!1,b=_=NaN}function p(){v&&(g(m,M),x&&w&&E.rejoin(),v.push(E.buffer())),C.point=s,w&&a.lineEnd()}function g(n,t){n=Math.max(-Ha,Math.min(Ha,n)),t=Math.max(-Ha,Math.min(Ha,t));var e=f(n,t);if(d&&y.push([n,t]),S)m=n,M=t,x=e,S=!1,e&&(a.lineStart(),a.point(n,t));else if(e&&w)a.point(n,t);else{var r={a:{x:b,y:_},b:{x:n,y:t}};A(r)?(w||(a.lineStart(),a.point(r.a.x,r.a.y)),a.point(r.b.x,r.b.y),e||a.lineEnd(),k=!1):e&&(a.lineStart(),a.point(n,t),k=!1)}b=n,_=t,w=e}var v,d,y,m,M,x,b,_,w,S,k,N=a,E=Pt(),A=Yt(n,t,e,r),C={point:s,lineStart:h,lineEnd:p,polygonStart:function(){a=E,v=[],d=[],k=!0},polygonEnd:function(){a=N,v=ao.merge(v);var t=l([n,r]),e=k&&t,i=v.length;(e||i)&&(a.polygonStart(),e&&(a.lineStart(),c(null,null,1,a),a.lineEnd()),i&&Lt(v,u,t,c,a),a.polygonEnd()),v=d=y=null}};return C}}function Vt(n){var t=0,e=Fo/3,r=ae(n),i=r(t,e);return i.parallels=function(n){return arguments.length?r(t=n[0]*Fo/180,e=n[1]*Fo/180):[t/Fo*180,e/Fo*180]},i}function Xt(n,t){function e(n,t){var e=Math.sqrt(u-2*i*Math.sin(t))/i;return[e*Math.sin(n*=i),o-e*Math.cos(n)]}var r=Math.sin(n),i=(r+Math.sin(t))/2,u=1+r*(2*i-r),o=Math.sqrt(u)/i;return e.invert=function(n,t){var e=o-t;return[Math.atan2(n,e)/i,tn((u-(n*n+e*e)*i*i)/(2*i))]},e}function $t(){function n(n,t){Ia+=i*n-r*t,r=n,i=t}var t,e,r,i;$a.point=function(u,o){$a.point=n,t=r=u,e=i=o},$a.lineEnd=function(){n(t,e)}}function Bt(n,t){Ya>n&&(Ya=n),n>Va&&(Va=n),Za>t&&(Za=t),t>Xa&&(Xa=t)}function Wt(){function n(n,t){o.push("M",n,",",t,u)}function t(n,t){o.push("M",n,",",t),a.point=e}function e(n,t){o.push("L",n,",",t)}function r(){a.point=n}function i(){o.push("Z")}var u=Jt(4.5),o=[],a={point:n,lineStart:function(){a.point=t},lineEnd:r,polygonStart:function(){a.lineEnd=i},polygonEnd:function(){a.lineEnd=r,a.point=n},pointRadius:function(n){return u=Jt(n),a},result:function(){if(o.length){var n=o.join("");return o=[],n}}};return a}function Jt(n){return"m0,"+n+"a"+n+","+n+" 0 1,1 0,"+-2*n+"a"+n+","+n+" 0 1,1 0,"+2*n+"z"}function Gt(n,t){Ca+=n,za+=t,++La}function Kt(){function n(n,r){var i=n-t,u=r-e,o=Math.sqrt(i*i+u*u);qa+=o*(t+n)/2,Ta+=o*(e+r)/2,Ra+=o,Gt(t=n,e=r)}var t,e;Wa.point=function(r,i){Wa.point=n,Gt(t=r,e=i)}}function Qt(){Wa.point=Gt}function ne(){function n(n,t){var e=n-r,u=t-i,o=Math.sqrt(e*e+u*u);qa+=o*(r+n)/2,Ta+=o*(i+t)/2,Ra+=o,o=i*n-r*t,Da+=o*(r+n),Pa+=o*(i+t),Ua+=3*o,Gt(r=n,i=t)}var t,e,r,i;Wa.point=function(u,o){Wa.point=n,Gt(t=r=u,e=i=o)},Wa.lineEnd=function(){n(t,e)}}function te(n){function t(t,e){n.moveTo(t+o,e),n.arc(t,e,o,0,Ho)}function e(t,e){n.moveTo(t,e),a.point=r}function r(t,e){n.lineTo(t,e)}function i(){a.point=t}function u(){n.closePath()}var o=4.5,a={point:t,lineStart:function(){a.point=e},lineEnd:i,polygonStart:function(){a.lineEnd=u},polygonEnd:function(){a.lineEnd=i,a.point=t},pointRadius:function(n){return o=n,a},result:b};return a}function ee(n){function t(n){return(a?r:e)(n)}function e(t){return ue(t,function(e,r){e=n(e,r),t.point(e[0],e[1])})}function r(t){function e(e,r){e=n(e,r),t.point(e[0],e[1])}function r(){M=NaN,S.point=u,t.lineStart()}function u(e,r){var u=dt([e,r]),o=n(e,r);i(M,x,m,b,_,w,M=o[0],x=o[1],m=e,b=u[0],_=u[1],w=u[2],a,t),t.point(M,x)}function o(){S.point=e,t.lineEnd()}function l(){
r(),S.point=c,S.lineEnd=f}function c(n,t){u(s=n,h=t),p=M,g=x,v=b,d=_,y=w,S.point=u}function f(){i(M,x,m,b,_,w,p,g,s,v,d,y,a,t),S.lineEnd=o,o()}var s,h,p,g,v,d,y,m,M,x,b,_,w,S={point:e,lineStart:r,lineEnd:o,polygonStart:function(){t.polygonStart(),S.lineStart=l},polygonEnd:function(){t.polygonEnd(),S.lineStart=r}};return S}function i(t,e,r,a,l,c,f,s,h,p,g,v,d,y){var m=f-t,M=s-e,x=m*m+M*M;if(x>4*u&&d--){var b=a+p,_=l+g,w=c+v,S=Math.sqrt(b*b+_*_+w*w),k=Math.asin(w/=S),N=xo(xo(w)-1)<Uo||xo(r-h)<Uo?(r+h)/2:Math.atan2(_,b),E=n(N,k),A=E[0],C=E[1],z=A-t,L=C-e,q=M*z-m*L;(q*q/x>u||xo((m*z+M*L)/x-.5)>.3||o>a*p+l*g+c*v)&&(i(t,e,r,a,l,c,A,C,N,b/=S,_/=S,w,d,y),y.point(A,C),i(A,C,N,b,_,w,f,s,h,p,g,v,d,y))}}var u=.5,o=Math.cos(30*Yo),a=16;return t.precision=function(n){return arguments.length?(a=(u=n*n)>0&&16,t):Math.sqrt(u)},t}function re(n){var t=ee(function(t,e){return n([t*Zo,e*Zo])});return function(n){return le(t(n))}}function ie(n){this.stream=n}function ue(n,t){return{point:t,sphere:function(){n.sphere()},lineStart:function(){n.lineStart()},lineEnd:function(){n.lineEnd()},polygonStart:function(){n.polygonStart()},polygonEnd:function(){n.polygonEnd()}}}function oe(n){return ae(function(){return n})()}function ae(n){function t(n){return n=a(n[0]*Yo,n[1]*Yo),[n[0]*h+l,c-n[1]*h]}function e(n){return n=a.invert((n[0]-l)/h,(c-n[1])/h),n&&[n[0]*Zo,n[1]*Zo]}function r(){a=Ct(o=se(y,M,x),u);var n=u(v,d);return l=p-n[0]*h,c=g+n[1]*h,i()}function i(){return f&&(f.valid=!1,f=null),t}var u,o,a,l,c,f,s=ee(function(n,t){return n=u(n,t),[n[0]*h+l,c-n[1]*h]}),h=150,p=480,g=250,v=0,d=0,y=0,M=0,x=0,b=Fa,_=m,w=null,S=null;return t.stream=function(n){return f&&(f.valid=!1),f=le(b(o,s(_(n)))),f.valid=!0,f},t.clipAngle=function(n){return arguments.length?(b=null==n?(w=n,Fa):It((w=+n)*Yo),i()):w},t.clipExtent=function(n){return arguments.length?(S=n,_=n?Zt(n[0][0],n[0][1],n[1][0],n[1][1]):m,i()):S},t.scale=function(n){return arguments.length?(h=+n,r()):h},t.translate=function(n){return arguments.length?(p=+n[0],g=+n[1],r()):[p,g]},t.center=function(n){return arguments.length?(v=n[0]%360*Yo,d=n[1]%360*Yo,r()):[v*Zo,d*Zo]},t.rotate=function(n){return arguments.length?(y=n[0]%360*Yo,M=n[1]%360*Yo,x=n.length>2?n[2]%360*Yo:0,r()):[y*Zo,M*Zo,x*Zo]},ao.rebind(t,s,"precision"),function(){return u=n.apply(this,arguments),t.invert=u.invert&&e,r()}}function le(n){return ue(n,function(t,e){n.point(t*Yo,e*Yo)})}function ce(n,t){return[n,t]}function fe(n,t){return[n>Fo?n-Ho:-Fo>n?n+Ho:n,t]}function se(n,t,e){return n?t||e?Ct(pe(n),ge(t,e)):pe(n):t||e?ge(t,e):fe}function he(n){return function(t,e){return t+=n,[t>Fo?t-Ho:-Fo>t?t+Ho:t,e]}}function pe(n){var t=he(n);return t.invert=he(-n),t}function ge(n,t){function e(n,t){var e=Math.cos(t),a=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),f=c*r+a*i;return[Math.atan2(l*u-f*o,a*r-c*i),tn(f*u+l*o)]}var r=Math.cos(n),i=Math.sin(n),u=Math.cos(t),o=Math.sin(t);return e.invert=function(n,t){var e=Math.cos(t),a=Math.cos(n)*e,l=Math.sin(n)*e,c=Math.sin(t),f=c*u-l*o;return[Math.atan2(l*u+c*o,a*r+f*i),tn(f*r-a*i)]},e}function ve(n,t){var e=Math.cos(n),r=Math.sin(n);return function(i,u,o,a){var l=o*t;null!=i?(i=de(e,i),u=de(e,u),(o>0?u>i:i>u)&&(i+=o*Ho)):(i=n+o*Ho,u=n-.5*l);for(var c,f=i;o>0?f>u:u>f;f-=l)a.point((c=_t([e,-r*Math.cos(f),-r*Math.sin(f)]))[0],c[1])}}function de(n,t){var e=dt(t);e[0]-=n,bt(e);var r=nn(-e[1]);return((-e[2]<0?-r:r)+2*Math.PI-Uo)%(2*Math.PI)}function ye(n,t,e){var r=ao.range(n,t-Uo,e).concat(t);return function(n){return r.map(function(t){return[n,t]})}}function me(n,t,e){var r=ao.range(n,t-Uo,e).concat(t);return function(n){return r.map(function(t){return[t,n]})}}function Me(n){return n.source}function xe(n){return n.target}function be(n,t,e,r){var i=Math.cos(t),u=Math.sin(t),o=Math.cos(r),a=Math.sin(r),l=i*Math.cos(n),c=i*Math.sin(n),f=o*Math.cos(e),s=o*Math.sin(e),h=2*Math.asin(Math.sqrt(on(r-t)+i*o*on(e-n))),p=1/Math.sin(h),g=h?function(n){var t=Math.sin(n*=h)*p,e=Math.sin(h-n)*p,r=e*l+t*f,i=e*c+t*s,o=e*u+t*a;return[Math.atan2(i,r)*Zo,Math.atan2(o,Math.sqrt(r*r+i*i))*Zo]}:function(){return[n*Zo,t*Zo]};return g.distance=h,g}function _e(){function n(n,i){var u=Math.sin(i*=Yo),o=Math.cos(i),a=xo((n*=Yo)-t),l=Math.cos(a);Ja+=Math.atan2(Math.sqrt((a=o*Math.sin(a))*a+(a=r*u-e*o*l)*a),e*u+r*o*l),t=n,e=u,r=o}var t,e,r;Ga.point=function(i,u){t=i*Yo,e=Math.sin(u*=Yo),r=Math.cos(u),Ga.point=n},Ga.lineEnd=function(){Ga.point=Ga.lineEnd=b}}function we(n,t){function e(t,e){var r=Math.cos(t),i=Math.cos(e),u=n(r*i);return[u*i*Math.sin(t),u*Math.sin(e)]}return e.invert=function(n,e){var r=Math.sqrt(n*n+e*e),i=t(r),u=Math.sin(i),o=Math.cos(i);return[Math.atan2(n*u,r*o),Math.asin(r&&e*u/r)]},e}function Se(n,t){function e(n,t){o>0?-Io+Uo>t&&(t=-Io+Uo):t>Io-Uo&&(t=Io-Uo);var e=o/Math.pow(i(t),u);return[e*Math.sin(u*n),o-e*Math.cos(u*n)]}var r=Math.cos(n),i=function(n){return Math.tan(Fo/4+n/2)},u=n===t?Math.sin(n):Math.log(r/Math.cos(t))/Math.log(i(t)/i(n)),o=r*Math.pow(i(n),u)/u;return u?(e.invert=function(n,t){var e=o-t,r=K(u)*Math.sqrt(n*n+e*e);return[Math.atan2(n,e)/u,2*Math.atan(Math.pow(o/r,1/u))-Io]},e):Ne}function ke(n,t){function e(n,t){var e=u-t;return[e*Math.sin(i*n),u-e*Math.cos(i*n)]}var r=Math.cos(n),i=n===t?Math.sin(n):(r-Math.cos(t))/(t-n),u=r/i+n;return xo(i)<Uo?ce:(e.invert=function(n,t){var e=u-t;return[Math.atan2(n,e)/i,u-K(i)*Math.sqrt(n*n+e*e)]},e)}function Ne(n,t){return[n,Math.log(Math.tan(Fo/4+t/2))]}function Ee(n){var t,e=oe(n),r=e.scale,i=e.translate,u=e.clipExtent;return e.scale=function(){var n=r.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.translate=function(){var n=i.apply(e,arguments);return n===e?t?e.clipExtent(null):e:n},e.clipExtent=function(n){var o=u.apply(e,arguments);if(o===e){if(t=null==n){var a=Fo*r(),l=i();u([[l[0]-a,l[1]-a],[l[0]+a,l[1]+a]])}}else t&&(o=null);return o},e.clipExtent(null)}function Ae(n,t){return[Math.log(Math.tan(Fo/4+t/2)),-n]}function Ce(n){return n[0]}function ze(n){return n[1]}function Le(n){for(var t=n.length,e=[0,1],r=2,i=2;t>i;i++){for(;r>1&&Q(n[e[r-2]],n[e[r-1]],n[i])<=0;)--r;e[r++]=i}return e.slice(0,r)}function qe(n,t){return n[0]-t[0]||n[1]-t[1]}function Te(n,t,e){return(e[0]-t[0])*(n[1]-t[1])<(e[1]-t[1])*(n[0]-t[0])}function Re(n,t,e,r){var i=n[0],u=e[0],o=t[0]-i,a=r[0]-u,l=n[1],c=e[1],f=t[1]-l,s=r[1]-c,h=(a*(l-c)-s*(i-u))/(s*o-a*f);return[i+h*o,l+h*f]}function De(n){var t=n[0],e=n[n.length-1];return!(t[0]-e[0]||t[1]-e[1])}function Pe(){rr(this),this.edge=this.site=this.circle=null}function Ue(n){var t=cl.pop()||new Pe;return t.site=n,t}function je(n){Be(n),ol.remove(n),cl.push(n),rr(n)}function Fe(n){var t=n.circle,e=t.x,r=t.cy,i={x:e,y:r},u=n.P,o=n.N,a=[n];je(n);for(var l=u;l.circle&&xo(e-l.circle.x)<Uo&&xo(r-l.circle.cy)<Uo;)u=l.P,a.unshift(l),je(l),l=u;a.unshift(l),Be(l);for(var c=o;c.circle&&xo(e-c.circle.x)<Uo&&xo(r-c.circle.cy)<Uo;)o=c.N,a.push(c),je(c),c=o;a.push(c),Be(c);var f,s=a.length;for(f=1;s>f;++f)c=a[f],l=a[f-1],nr(c.edge,l.site,c.site,i);l=a[0],c=a[s-1],c.edge=Ke(l.site,c.site,null,i),$e(l),$e(c)}function He(n){for(var t,e,r,i,u=n.x,o=n.y,a=ol._;a;)if(r=Oe(a,o)-u,r>Uo)a=a.L;else{if(i=u-Ie(a,o),!(i>Uo)){r>-Uo?(t=a.P,e=a):i>-Uo?(t=a,e=a.N):t=e=a;break}if(!a.R){t=a;break}a=a.R}var l=Ue(n);if(ol.insert(t,l),t||e){if(t===e)return Be(t),e=Ue(t.site),ol.insert(l,e),l.edge=e.edge=Ke(t.site,l.site),$e(t),void $e(e);if(!e)return void(l.edge=Ke(t.site,l.site));Be(t),Be(e);var c=t.site,f=c.x,s=c.y,h=n.x-f,p=n.y-s,g=e.site,v=g.x-f,d=g.y-s,y=2*(h*d-p*v),m=h*h+p*p,M=v*v+d*d,x={x:(d*m-p*M)/y+f,y:(h*M-v*m)/y+s};nr(e.edge,c,g,x),l.edge=Ke(c,n,null,x),e.edge=Ke(n,g,null,x),$e(t),$e(e)}}function Oe(n,t){var e=n.site,r=e.x,i=e.y,u=i-t;if(!u)return r;var o=n.P;if(!o)return-(1/0);e=o.site;var a=e.x,l=e.y,c=l-t;if(!c)return a;var f=a-r,s=1/u-1/c,h=f/c;return s?(-h+Math.sqrt(h*h-2*s*(f*f/(-2*c)-l+c/2+i-u/2)))/s+r:(r+a)/2}function Ie(n,t){var e=n.N;if(e)return Oe(e,t);var r=n.site;return r.y===t?r.x:1/0}function Ye(n){this.site=n,this.edges=[]}function Ze(n){for(var t,e,r,i,u,o,a,l,c,f,s=n[0][0],h=n[1][0],p=n[0][1],g=n[1][1],v=ul,d=v.length;d--;)if(u=v[d],u&&u.prepare())for(a=u.edges,l=a.length,o=0;l>o;)f=a[o].end(),r=f.x,i=f.y,c=a[++o%l].start(),t=c.x,e=c.y,(xo(r-t)>Uo||xo(i-e)>Uo)&&(a.splice(o,0,new tr(Qe(u.site,f,xo(r-s)<Uo&&g-i>Uo?{x:s,y:xo(t-s)<Uo?e:g}:xo(i-g)<Uo&&h-r>Uo?{x:xo(e-g)<Uo?t:h,y:g}:xo(r-h)<Uo&&i-p>Uo?{x:h,y:xo(t-h)<Uo?e:p}:xo(i-p)<Uo&&r-s>Uo?{x:xo(e-p)<Uo?t:s,y:p}:null),u.site,null)),++l)}function Ve(n,t){return t.angle-n.angle}function Xe(){rr(this),this.x=this.y=this.arc=this.site=this.cy=null}function $e(n){var t=n.P,e=n.N;if(t&&e){var r=t.site,i=n.site,u=e.site;if(r!==u){var o=i.x,a=i.y,l=r.x-o,c=r.y-a,f=u.x-o,s=u.y-a,h=2*(l*s-c*f);if(!(h>=-jo)){var p=l*l+c*c,g=f*f+s*s,v=(s*p-c*g)/h,d=(l*g-f*p)/h,s=d+a,y=fl.pop()||new Xe;y.arc=n,y.site=i,y.x=v+o,y.y=s+Math.sqrt(v*v+d*d),y.cy=s,n.circle=y;for(var m=null,M=ll._;M;)if(y.y<M.y||y.y===M.y&&y.x<=M.x){if(!M.L){m=M.P;break}M=M.L}else{if(!M.R){m=M;break}M=M.R}ll.insert(m,y),m||(al=y)}}}}function Be(n){var t=n.circle;t&&(t.P||(al=t.N),ll.remove(t),fl.push(t),rr(t),n.circle=null)}function We(n){for(var t,e=il,r=Yt(n[0][0],n[0][1],n[1][0],n[1][1]),i=e.length;i--;)t=e[i],(!Je(t,n)||!r(t)||xo(t.a.x-t.b.x)<Uo&&xo(t.a.y-t.b.y)<Uo)&&(t.a=t.b=null,e.splice(i,1))}function Je(n,t){var e=n.b;if(e)return!0;var r,i,u=n.a,o=t[0][0],a=t[1][0],l=t[0][1],c=t[1][1],f=n.l,s=n.r,h=f.x,p=f.y,g=s.x,v=s.y,d=(h+g)/2,y=(p+v)/2;if(v===p){if(o>d||d>=a)return;if(h>g){if(u){if(u.y>=c)return}else u={x:d,y:l};e={x:d,y:c}}else{if(u){if(u.y<l)return}else u={x:d,y:c};e={x:d,y:l}}}else if(r=(h-g)/(v-p),i=y-r*d,-1>r||r>1)if(h>g){if(u){if(u.y>=c)return}else u={x:(l-i)/r,y:l};e={x:(c-i)/r,y:c}}else{if(u){if(u.y<l)return}else u={x:(c-i)/r,y:c};e={x:(l-i)/r,y:l}}else if(v>p){if(u){if(u.x>=a)return}else u={x:o,y:r*o+i};e={x:a,y:r*a+i}}else{if(u){if(u.x<o)return}else u={x:a,y:r*a+i};e={x:o,y:r*o+i}}return n.a=u,n.b=e,!0}function Ge(n,t){this.l=n,this.r=t,this.a=this.b=null}function Ke(n,t,e,r){var i=new Ge(n,t);return il.push(i),e&&nr(i,n,t,e),r&&nr(i,t,n,r),ul[n.i].edges.push(new tr(i,n,t)),ul[t.i].edges.push(new tr(i,t,n)),i}function Qe(n,t,e){var r=new Ge(n,null);return r.a=t,r.b=e,il.push(r),r}function nr(n,t,e,r){n.a||n.b?n.l===e?n.b=r:n.a=r:(n.a=r,n.l=t,n.r=e)}function tr(n,t,e){var r=n.a,i=n.b;this.edge=n,this.site=t,this.angle=e?Math.atan2(e.y-t.y,e.x-t.x):n.l===t?Math.atan2(i.x-r.x,r.y-i.y):Math.atan2(r.x-i.x,i.y-r.y)}function er(){this._=null}function rr(n){n.U=n.C=n.L=n.R=n.P=n.N=null}function ir(n,t){var e=t,r=t.R,i=e.U;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.R=r.L,e.R&&(e.R.U=e),r.L=e}function ur(n,t){var e=t,r=t.L,i=e.U;i?i.L===e?i.L=r:i.R=r:n._=r,r.U=i,e.U=r,e.L=r.R,e.L&&(e.L.U=e),r.R=e}function or(n){for(;n.L;)n=n.L;return n}function ar(n,t){var e,r,i,u=n.sort(lr).pop();for(il=[],ul=new Array(n.length),ol=new er,ll=new er;;)if(i=al,u&&(!i||u.y<i.y||u.y===i.y&&u.x<i.x))u.x===e&&u.y===r||(ul[u.i]=new Ye(u),He(u),e=u.x,r=u.y),u=n.pop();else{if(!i)break;Fe(i.arc)}t&&(We(t),Ze(t));var o={cells:ul,edges:il};return ol=ll=il=ul=null,o}function lr(n,t){return t.y-n.y||t.x-n.x}function cr(n,t,e){return(n.x-e.x)*(t.y-n.y)-(n.x-t.x)*(e.y-n.y)}function fr(n){return n.x}function sr(n){return n.y}function hr(){return{leaf:!0,nodes:[],point:null,x:null,y:null}}function pr(n,t,e,r,i,u){if(!n(t,e,r,i,u)){var o=.5*(e+i),a=.5*(r+u),l=t.nodes;l[0]&&pr(n,l[0],e,r,o,a),l[1]&&pr(n,l[1],o,r,i,a),l[2]&&pr(n,l[2],e,a,o,u),l[3]&&pr(n,l[3],o,a,i,u)}}function gr(n,t,e,r,i,u,o){var a,l=1/0;return function c(n,f,s,h,p){if(!(f>u||s>o||r>h||i>p)){if(g=n.point){var g,v=t-n.x,d=e-n.y,y=v*v+d*d;if(l>y){var m=Math.sqrt(l=y);r=t-m,i=e-m,u=t+m,o=e+m,a=g}}for(var M=n.nodes,x=.5*(f+h),b=.5*(s+p),_=t>=x,w=e>=b,S=w<<1|_,k=S+4;k>S;++S)if(n=M[3&S])switch(3&S){case 0:c(n,f,s,x,b);break;case 1:c(n,x,s,h,b);break;case 2:c(n,f,b,x,p);break;case 3:c(n,x,b,h,p)}}}(n,r,i,u,o),a}function vr(n,t){n=ao.rgb(n),t=ao.rgb(t);var e=n.r,r=n.g,i=n.b,u=t.r-e,o=t.g-r,a=t.b-i;return function(n){return"#"+bn(Math.round(e+u*n))+bn(Math.round(r+o*n))+bn(Math.round(i+a*n))}}function dr(n,t){var e,r={},i={};for(e in n)e in t?r[e]=Mr(n[e],t[e]):i[e]=n[e];for(e in t)e in n||(i[e]=t[e]);return function(n){for(e in r)i[e]=r[e](n);return i}}function yr(n,t){return n=+n,t=+t,function(e){return n*(1-e)+t*e}}function mr(n,t){var e,r,i,u=hl.lastIndex=pl.lastIndex=0,o=-1,a=[],l=[];for(n+="",t+="";(e=hl.exec(n))&&(r=pl.exec(t));)(i=r.index)>u&&(i=t.slice(u,i),a[o]?a[o]+=i:a[++o]=i),(e=e[0])===(r=r[0])?a[o]?a[o]+=r:a[++o]=r:(a[++o]=null,l.push({i:o,x:yr(e,r)})),u=pl.lastIndex;return u<t.length&&(i=t.slice(u),a[o]?a[o]+=i:a[++o]=i),a.length<2?l[0]?(t=l[0].x,function(n){return t(n)+""}):function(){return t}:(t=l.length,function(n){for(var e,r=0;t>r;++r)a[(e=l[r]).i]=e.x(n);return a.join("")})}function Mr(n,t){for(var e,r=ao.interpolators.length;--r>=0&&!(e=ao.interpolators[r](n,t)););return e}function xr(n,t){var e,r=[],i=[],u=n.length,o=t.length,a=Math.min(n.length,t.length);for(e=0;a>e;++e)r.push(Mr(n[e],t[e]));for(;u>e;++e)i[e]=n[e];for(;o>e;++e)i[e]=t[e];return function(n){for(e=0;a>e;++e)i[e]=r[e](n);return i}}function br(n){return function(t){return 0>=t?0:t>=1?1:n(t)}}function _r(n){return function(t){return 1-n(1-t)}}function wr(n){return function(t){return.5*(.5>t?n(2*t):2-n(2-2*t))}}function Sr(n){return n*n}function kr(n){return n*n*n}function Nr(n){if(0>=n)return 0;if(n>=1)return 1;var t=n*n,e=t*n;return 4*(.5>n?e:3*(n-t)+e-.75)}function Er(n){return function(t){return Math.pow(t,n)}}function Ar(n){return 1-Math.cos(n*Io)}function Cr(n){return Math.pow(2,10*(n-1))}function zr(n){return 1-Math.sqrt(1-n*n)}function Lr(n,t){var e;return arguments.length<2&&(t=.45),arguments.length?e=t/Ho*Math.asin(1/n):(n=1,e=t/4),function(r){return 1+n*Math.pow(2,-10*r)*Math.sin((r-e)*Ho/t)}}function qr(n){return n||(n=1.70158),function(t){return t*t*((n+1)*t-n)}}function Tr(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375}function Rr(n,t){n=ao.hcl(n),t=ao.hcl(t);var e=n.h,r=n.c,i=n.l,u=t.h-e,o=t.c-r,a=t.l-i;return isNaN(o)&&(o=0,r=isNaN(r)?t.c:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return sn(e+u*n,r+o*n,i+a*n)+""}}function Dr(n,t){n=ao.hsl(n),t=ao.hsl(t);var e=n.h,r=n.s,i=n.l,u=t.h-e,o=t.s-r,a=t.l-i;return isNaN(o)&&(o=0,r=isNaN(r)?t.s:r),isNaN(u)?(u=0,e=isNaN(e)?t.h:e):u>180?u-=360:-180>u&&(u+=360),function(n){return cn(e+u*n,r+o*n,i+a*n)+""}}function Pr(n,t){n=ao.lab(n),t=ao.lab(t);var e=n.l,r=n.a,i=n.b,u=t.l-e,o=t.a-r,a=t.b-i;return function(n){return pn(e+u*n,r+o*n,i+a*n)+""}}function Ur(n,t){return t-=n,function(e){return Math.round(n+t*e)}}function jr(n){var t=[n.a,n.b],e=[n.c,n.d],r=Hr(t),i=Fr(t,e),u=Hr(Or(e,t,-i))||0;t[0]*e[1]<e[0]*t[1]&&(t[0]*=-1,t[1]*=-1,r*=-1,i*=-1),this.rotate=(r?Math.atan2(t[1],t[0]):Math.atan2(-e[0],e[1]))*Zo,this.translate=[n.e,n.f],this.scale=[r,u],this.skew=u?Math.atan2(i,u)*Zo:0}function Fr(n,t){return n[0]*t[0]+n[1]*t[1]}function Hr(n){var t=Math.sqrt(Fr(n,n));return t&&(n[0]/=t,n[1]/=t),t}function Or(n,t,e){return n[0]+=e*t[0],n[1]+=e*t[1],n}function Ir(n){return n.length?n.pop()+",":""}function Yr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push("translate(",null,",",null,")");r.push({i:i-4,x:yr(n[0],t[0])},{i:i-2,x:yr(n[1],t[1])})}else(t[0]||t[1])&&e.push("translate("+t+")")}function Zr(n,t,e,r){n!==t?(n-t>180?t+=360:t-n>180&&(n+=360),r.push({i:e.push(Ir(e)+"rotate(",null,")")-2,x:yr(n,t)})):t&&e.push(Ir(e)+"rotate("+t+")")}function Vr(n,t,e,r){n!==t?r.push({i:e.push(Ir(e)+"skewX(",null,")")-2,x:yr(n,t)}):t&&e.push(Ir(e)+"skewX("+t+")")}function Xr(n,t,e,r){if(n[0]!==t[0]||n[1]!==t[1]){var i=e.push(Ir(e)+"scale(",null,",",null,")");r.push({i:i-4,x:yr(n[0],t[0])},{i:i-2,x:yr(n[1],t[1])})}else 1===t[0]&&1===t[1]||e.push(Ir(e)+"scale("+t+")")}function $r(n,t){var e=[],r=[];return n=ao.transform(n),t=ao.transform(t),Yr(n.translate,t.translate,e,r),Zr(n.rotate,t.rotate,e,r),Vr(n.skew,t.skew,e,r),Xr(n.scale,t.scale,e,r),n=t=null,function(n){for(var t,i=-1,u=r.length;++i<u;)e[(t=r[i]).i]=t.x(n);return e.join("")}}function Br(n,t){return t=(t-=n=+n)||1/t,function(e){return(e-n)/t}}function Wr(n,t){return t=(t-=n=+n)||1/t,function(e){return Math.max(0,Math.min(1,(e-n)/t))}}function Jr(n){for(var t=n.source,e=n.target,r=Kr(t,e),i=[t];t!==r;)t=t.parent,i.push(t);for(var u=i.length;e!==r;)i.splice(u,0,e),e=e.parent;return i}function Gr(n){for(var t=[],e=n.parent;null!=e;)t.push(n),n=e,e=e.parent;return t.push(n),t}function Kr(n,t){if(n===t)return n;for(var e=Gr(n),r=Gr(t),i=e.pop(),u=r.pop(),o=null;i===u;)o=i,i=e.pop(),u=r.pop();return o}function Qr(n){n.fixed|=2}function ni(n){n.fixed&=-7}function ti(n){n.fixed|=4,n.px=n.x,n.py=n.y}function ei(n){n.fixed&=-5}function ri(n,t,e){var r=0,i=0;if(n.charge=0,!n.leaf)for(var u,o=n.nodes,a=o.length,l=-1;++l<a;)u=o[l],null!=u&&(ri(u,t,e),n.charge+=u.charge,r+=u.charge*u.cx,i+=u.charge*u.cy);if(n.point){n.leaf||(n.point.x+=Math.random()-.5,n.point.y+=Math.random()-.5);var c=t*e[n.point.index];n.charge+=n.pointCharge=c,r+=c*n.point.x,i+=c*n.point.y}n.cx=r/n.charge,n.cy=i/n.charge}function ii(n,t){return ao.rebind(n,t,"sort","children","value"),n.nodes=n,n.links=fi,n}function ui(n,t){for(var e=[n];null!=(n=e.pop());)if(t(n),(i=n.children)&&(r=i.length))for(var r,i;--r>=0;)e.push(i[r])}function oi(n,t){for(var e=[n],r=[];null!=(n=e.pop());)if(r.push(n),(u=n.children)&&(i=u.length))for(var i,u,o=-1;++o<i;)e.push(u[o]);for(;null!=(n=r.pop());)t(n)}function ai(n){return n.children}function li(n){return n.value}function ci(n,t){return t.value-n.value}function fi(n){return ao.merge(n.map(function(n){return(n.children||[]).map(function(t){return{source:n,target:t}})}))}function si(n){return n.x}function hi(n){return n.y}function pi(n,t,e){n.y0=t,n.y=e}function gi(n){return ao.range(n.length)}function vi(n){for(var t=-1,e=n[0].length,r=[];++t<e;)r[t]=0;return r}function di(n){for(var t,e=1,r=0,i=n[0][1],u=n.length;u>e;++e)(t=n[e][1])>i&&(r=e,i=t);return r}function yi(n){return n.reduce(mi,0)}function mi(n,t){return n+t[1]}function Mi(n,t){return xi(n,Math.ceil(Math.log(t.length)/Math.LN2+1))}function xi(n,t){for(var e=-1,r=+n[0],i=(n[1]-r)/t,u=[];++e<=t;)u[e]=i*e+r;return u}function bi(n){return[ao.min(n),ao.max(n)]}function _i(n,t){return n.value-t.value}function wi(n,t){var e=n._pack_next;n._pack_next=t,t._pack_prev=n,t._pack_next=e,e._pack_prev=t}function Si(n,t){n._pack_next=t,t._pack_prev=n}function ki(n,t){var e=t.x-n.x,r=t.y-n.y,i=n.r+t.r;return.999*i*i>e*e+r*r}function Ni(n){function t(n){f=Math.min(n.x-n.r,f),s=Math.max(n.x+n.r,s),h=Math.min(n.y-n.r,h),p=Math.max(n.y+n.r,p)}if((e=n.children)&&(c=e.length)){var e,r,i,u,o,a,l,c,f=1/0,s=-(1/0),h=1/0,p=-(1/0);if(e.forEach(Ei),r=e[0],r.x=-r.r,r.y=0,t(r),c>1&&(i=e[1],i.x=i.r,i.y=0,t(i),c>2))for(u=e[2],zi(r,i,u),t(u),wi(r,u),r._pack_prev=u,wi(u,i),i=r._pack_next,o=3;c>o;o++){zi(r,i,u=e[o]);var g=0,v=1,d=1;for(a=i._pack_next;a!==i;a=a._pack_next,v++)if(ki(a,u)){g=1;break}if(1==g)for(l=r._pack_prev;l!==a._pack_prev&&!ki(l,u);l=l._pack_prev,d++);g?(d>v||v==d&&i.r<r.r?Si(r,i=a):Si(r=l,i),o--):(wi(r,u),i=u,t(u))}var y=(f+s)/2,m=(h+p)/2,M=0;for(o=0;c>o;o++)u=e[o],u.x-=y,u.y-=m,M=Math.max(M,u.r+Math.sqrt(u.x*u.x+u.y*u.y));n.r=M,e.forEach(Ai)}}function Ei(n){n._pack_next=n._pack_prev=n}function Ai(n){delete n._pack_next,delete n._pack_prev}function Ci(n,t,e,r){var i=n.children;if(n.x=t+=r*n.x,n.y=e+=r*n.y,n.r*=r,i)for(var u=-1,o=i.length;++u<o;)Ci(i[u],t,e,r)}function zi(n,t,e){var r=n.r+e.r,i=t.x-n.x,u=t.y-n.y;if(r&&(i||u)){var o=t.r+e.r,a=i*i+u*u;o*=o,r*=r;var l=.5+(r-o)/(2*a),c=Math.sqrt(Math.max(0,2*o*(r+a)-(r-=a)*r-o*o))/(2*a);e.x=n.x+l*i+c*u,e.y=n.y+l*u-c*i}else e.x=n.x+r,e.y=n.y}function Li(n,t){return n.parent==t.parent?1:2}function qi(n){var t=n.children;return t.length?t[0]:n.t}function Ti(n){var t,e=n.children;return(t=e.length)?e[t-1]:n.t}function Ri(n,t,e){var r=e/(t.i-n.i);t.c-=r,t.s+=e,n.c+=r,t.z+=e,t.m+=e}function Di(n){for(var t,e=0,r=0,i=n.children,u=i.length;--u>=0;)t=i[u],t.z+=e,t.m+=e,e+=t.s+(r+=t.c)}function Pi(n,t,e){return n.a.parent===t.parent?n.a:e}function Ui(n){return 1+ao.max(n,function(n){return n.y})}function ji(n){return n.reduce(function(n,t){return n+t.x},0)/n.length}function Fi(n){var t=n.children;return t&&t.length?Fi(t[0]):n}function Hi(n){var t,e=n.children;return e&&(t=e.length)?Hi(e[t-1]):n}function Oi(n){return{x:n.x,y:n.y,dx:n.dx,dy:n.dy}}function Ii(n,t){var e=n.x+t[3],r=n.y+t[0],i=n.dx-t[1]-t[3],u=n.dy-t[0]-t[2];return 0>i&&(e+=i/2,i=0),0>u&&(r+=u/2,u=0),{x:e,y:r,dx:i,dy:u}}function Yi(n){var t=n[0],e=n[n.length-1];return e>t?[t,e]:[e,t]}function Zi(n){return n.rangeExtent?n.rangeExtent():Yi(n.range())}function Vi(n,t,e,r){var i=e(n[0],n[1]),u=r(t[0],t[1]);return function(n){return u(i(n))}}function Xi(n,t){var e,r=0,i=n.length-1,u=n[r],o=n[i];return u>o&&(e=r,r=i,i=e,e=u,u=o,o=e),n[r]=t.floor(u),n[i]=t.ceil(o),n}function $i(n){return n?{floor:function(t){return Math.floor(t/n)*n},ceil:function(t){return Math.ceil(t/n)*n}}:Sl}function Bi(n,t,e,r){var i=[],u=[],o=0,a=Math.min(n.length,t.length)-1;for(n[a]<n[0]&&(n=n.slice().reverse(),t=t.slice().reverse());++o<=a;)i.push(e(n[o-1],n[o])),u.push(r(t[o-1],t[o]));return function(t){var e=ao.bisect(n,t,1,a)-1;return u[e](i[e](t))}}function Wi(n,t,e,r){function i(){var i=Math.min(n.length,t.length)>2?Bi:Vi,l=r?Wr:Br;return o=i(n,t,l,e),a=i(t,n,l,Mr),u}function u(n){return o(n)}var o,a;return u.invert=function(n){return a(n)},u.domain=function(t){return arguments.length?(n=t.map(Number),i()):n},u.range=function(n){return arguments.length?(t=n,i()):t},u.rangeRound=function(n){return u.range(n).interpolate(Ur)},u.clamp=function(n){return arguments.length?(r=n,i()):r},u.interpolate=function(n){return arguments.length?(e=n,i()):e},u.ticks=function(t){return Qi(n,t)},u.tickFormat=function(t,e){return nu(n,t,e)},u.nice=function(t){return Gi(n,t),i()},u.copy=function(){return Wi(n,t,e,r)},i()}function Ji(n,t){return ao.rebind(n,t,"range","rangeRound","interpolate","clamp")}function Gi(n,t){return Xi(n,$i(Ki(n,t)[2])),Xi(n,$i(Ki(n,t)[2])),n}function Ki(n,t){null==t&&(t=10);var e=Yi(n),r=e[1]-e[0],i=Math.pow(10,Math.floor(Math.log(r/t)/Math.LN10)),u=t/r*i;return.15>=u?i*=10:.35>=u?i*=5:.75>=u&&(i*=2),e[0]=Math.ceil(e[0]/i)*i,e[1]=Math.floor(e[1]/i)*i+.5*i,e[2]=i,e}function Qi(n,t){return ao.range.apply(ao,Ki(n,t))}function nu(n,t,e){var r=Ki(n,t);if(e){var i=ha.exec(e);if(i.shift(),"s"===i[8]){var u=ao.formatPrefix(Math.max(xo(r[0]),xo(r[1])));return i[7]||(i[7]="."+tu(u.scale(r[2]))),i[8]="f",e=ao.format(i.join("")),function(n){return e(u.scale(n))+u.symbol}}i[7]||(i[7]="."+eu(i[8],r)),e=i.join("")}else e=",."+tu(r[2])+"f";return ao.format(e)}function tu(n){return-Math.floor(Math.log(n)/Math.LN10+.01)}function eu(n,t){var e=tu(t[2]);return n in kl?Math.abs(e-tu(Math.max(xo(t[0]),xo(t[1]))))+ +("e"!==n):e-2*("%"===n)}function ru(n,t,e,r){function i(n){return(e?Math.log(0>n?0:n):-Math.log(n>0?0:-n))/Math.log(t)}function u(n){return e?Math.pow(t,n):-Math.pow(t,-n)}function o(t){return n(i(t))}return o.invert=function(t){return u(n.invert(t))},o.domain=function(t){return arguments.length?(e=t[0]>=0,n.domain((r=t.map(Number)).map(i)),o):r},o.base=function(e){return arguments.length?(t=+e,n.domain(r.map(i)),o):t},o.nice=function(){var t=Xi(r.map(i),e?Math:El);return n.domain(t),r=t.map(u),o},o.ticks=function(){var n=Yi(r),o=[],a=n[0],l=n[1],c=Math.floor(i(a)),f=Math.ceil(i(l)),s=t%1?2:t;if(isFinite(f-c)){if(e){for(;f>c;c++)for(var h=1;s>h;h++)o.push(u(c)*h);o.push(u(c))}else for(o.push(u(c));c++<f;)for(var h=s-1;h>0;h--)o.push(u(c)*h);for(c=0;o[c]<a;c++);for(f=o.length;o[f-1]>l;f--);o=o.slice(c,f)}return o},o.tickFormat=function(n,e){if(!arguments.length)return Nl;arguments.length<2?e=Nl:"function"!=typeof e&&(e=ao.format(e));var r=Math.max(1,t*n/o.ticks().length);return function(n){var o=n/u(Math.round(i(n)));return t-.5>o*t&&(o*=t),r>=o?e(n):""}},o.copy=function(){return ru(n.copy(),t,e,r)},Ji(o,n)}function iu(n,t,e){function r(t){return n(i(t))}var i=uu(t),u=uu(1/t);return r.invert=function(t){return u(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain((e=t.map(Number)).map(i)),r):e},r.ticks=function(n){return Qi(e,n)},r.tickFormat=function(n,t){return nu(e,n,t)},r.nice=function(n){return r.domain(Gi(e,n))},r.exponent=function(o){return arguments.length?(i=uu(t=o),u=uu(1/t),n.domain(e.map(i)),r):t},r.copy=function(){return iu(n.copy(),t,e)},Ji(r,n)}function uu(n){return function(t){return 0>t?-Math.pow(-t,n):Math.pow(t,n)}}function ou(n,t){function e(e){return u[((i.get(e)||("range"===t.t?i.set(e,n.push(e)):NaN))-1)%u.length]}function r(t,e){return ao.range(n.length).map(function(n){return t+e*n})}var i,u,o;return e.domain=function(r){if(!arguments.length)return n;n=[],i=new c;for(var u,o=-1,a=r.length;++o<a;)i.has(u=r[o])||i.set(u,n.push(u));return e[t.t].apply(e,t.a)},e.range=function(n){return arguments.length?(u=n,o=0,t={t:"range",a:arguments},e):u},e.rangePoints=function(i,a){arguments.length<2&&(a=0);var l=i[0],c=i[1],f=n.length<2?(l=(l+c)/2,0):(c-l)/(n.length-1+a);return u=r(l+f*a/2,f),o=0,t={t:"rangePoints",a:arguments},e},e.rangeRoundPoints=function(i,a){arguments.length<2&&(a=0);var l=i[0],c=i[1],f=n.length<2?(l=c=Math.round((l+c)/2),0):(c-l)/(n.length-1+a)|0;return u=r(l+Math.round(f*a/2+(c-l-(n.length-1+a)*f)/2),f),o=0,t={t:"rangeRoundPoints",a:arguments},e},e.rangeBands=function(i,a,l){arguments.length<2&&(a=0),arguments.length<3&&(l=a);var c=i[1]<i[0],f=i[c-0],s=i[1-c],h=(s-f)/(n.length-a+2*l);return u=r(f+h*l,h),c&&u.reverse(),o=h*(1-a),t={t:"rangeBands",a:arguments},e},e.rangeRoundBands=function(i,a,l){arguments.length<2&&(a=0),arguments.length<3&&(l=a);var c=i[1]<i[0],f=i[c-0],s=i[1-c],h=Math.floor((s-f)/(n.length-a+2*l));return u=r(f+Math.round((s-f-(n.length-a)*h)/2),h),c&&u.reverse(),o=Math.round(h*(1-a)),t={t:"rangeRoundBands",a:arguments},e},e.rangeBand=function(){return o},e.rangeExtent=function(){return Yi(t.a[0])},e.copy=function(){return ou(n,t)},e.domain(n)}function au(n,t){function u(){var e=0,r=t.length;for(a=[];++e<r;)a[e-1]=ao.quantile(n,e/r);return o}function o(n){return isNaN(n=+n)?void 0:t[ao.bisect(a,n)]}var a;return o.domain=function(t){return arguments.length?(n=t.map(r).filter(i).sort(e),u()):n},o.range=function(n){return arguments.length?(t=n,u()):t},o.quantiles=function(){return a},o.invertExtent=function(e){return e=t.indexOf(e),0>e?[NaN,NaN]:[e>0?a[e-1]:n[0],e<a.length?a[e]:n[n.length-1]]},o.copy=function(){return au(n,t)},u()}function lu(n,t,e){function r(t){return e[Math.max(0,Math.min(o,Math.floor(u*(t-n))))]}function i(){return u=e.length/(t-n),o=e.length-1,r}var u,o;return r.domain=function(e){return arguments.length?(n=+e[0],t=+e[e.length-1],i()):[n,t]},r.range=function(n){return arguments.length?(e=n,i()):e},r.invertExtent=function(t){return t=e.indexOf(t),t=0>t?NaN:t/u+n,[t,t+1/u]},r.copy=function(){return lu(n,t,e)},i()}function cu(n,t){function e(e){return e>=e?t[ao.bisect(n,e)]:void 0}return e.domain=function(t){return arguments.length?(n=t,e):n},e.range=function(n){return arguments.length?(t=n,e):t},e.invertExtent=function(e){return e=t.indexOf(e),[n[e-1],n[e]]},e.copy=function(){return cu(n,t)},e}function fu(n){function t(n){return+n}return t.invert=t,t.domain=t.range=function(e){return arguments.length?(n=e.map(t),t):n},t.ticks=function(t){return Qi(n,t)},t.tickFormat=function(t,e){return nu(n,t,e)},t.copy=function(){return fu(n)},t}function su(){return 0}function hu(n){return n.innerRadius}function pu(n){return n.outerRadius}function gu(n){return n.startAngle}function vu(n){return n.endAngle}function du(n){return n&&n.padAngle}function yu(n,t,e,r){return(n-e)*t-(t-r)*n>0?0:1}function mu(n,t,e,r,i){var u=n[0]-t[0],o=n[1]-t[1],a=(i?r:-r)/Math.sqrt(u*u+o*o),l=a*o,c=-a*u,f=n[0]+l,s=n[1]+c,h=t[0]+l,p=t[1]+c,g=(f+h)/2,v=(s+p)/2,d=h-f,y=p-s,m=d*d+y*y,M=e-r,x=f*p-h*s,b=(0>y?-1:1)*Math.sqrt(Math.max(0,M*M*m-x*x)),_=(x*y-d*b)/m,w=(-x*d-y*b)/m,S=(x*y+d*b)/m,k=(-x*d+y*b)/m,N=_-g,E=w-v,A=S-g,C=k-v;return N*N+E*E>A*A+C*C&&(_=S,w=k),[[_-l,w-c],[_*e/M,w*e/M]]}function Mu(n){function t(t){function o(){c.push("M",u(n(f),a))}for(var l,c=[],f=[],s=-1,h=t.length,p=En(e),g=En(r);++s<h;)i.call(this,l=t[s],s)?f.push([+p.call(this,l,s),+g.call(this,l,s)]):f.length&&(o(),f=[]);return f.length&&o(),c.length?c.join(""):null}var e=Ce,r=ze,i=zt,u=xu,o=u.key,a=.7;return t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t.defined=function(n){return arguments.length?(i=n,t):i},t.interpolate=function(n){return arguments.length?(o="function"==typeof n?u=n:(u=Tl.get(n)||xu).key,t):o},t.tension=function(n){return arguments.length?(a=n,t):a},t}function xu(n){return n.length>1?n.join("L"):n+"Z"}function bu(n){return n.join("L")+"Z"}function _u(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r[0]+(r=n[t])[0])/2,"V",r[1]);return e>1&&i.push("H",r[0]),i.join("")}function wu(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("V",(r=n[t])[1],"H",r[0]);return i.join("")}function Su(n){for(var t=0,e=n.length,r=n[0],i=[r[0],",",r[1]];++t<e;)i.push("H",(r=n[t])[0],"V",r[1]);return i.join("")}function ku(n,t){return n.length<4?xu(n):n[1]+Au(n.slice(1,-1),Cu(n,t))}function Nu(n,t){return n.length<3?bu(n):n[0]+Au((n.push(n[0]),n),Cu([n[n.length-2]].concat(n,[n[1]]),t))}function Eu(n,t){return n.length<3?xu(n):n[0]+Au(n,Cu(n,t))}function Au(n,t){if(t.length<1||n.length!=t.length&&n.length!=t.length+2)return xu(n);var e=n.length!=t.length,r="",i=n[0],u=n[1],o=t[0],a=o,l=1;if(e&&(r+="Q"+(u[0]-2*o[0]/3)+","+(u[1]-2*o[1]/3)+","+u[0]+","+u[1],i=n[1],l=2),t.length>1){a=t[1],u=n[l],l++,r+="C"+(i[0]+o[0])+","+(i[1]+o[1])+","+(u[0]-a[0])+","+(u[1]-a[1])+","+u[0]+","+u[1];for(var c=2;c<t.length;c++,l++)u=n[l],a=t[c],r+="S"+(u[0]-a[0])+","+(u[1]-a[1])+","+u[0]+","+u[1]}if(e){var f=n[l];r+="Q"+(u[0]+2*a[0]/3)+","+(u[1]+2*a[1]/3)+","+f[0]+","+f[1]}return r}function Cu(n,t){for(var e,r=[],i=(1-t)/2,u=n[0],o=n[1],a=1,l=n.length;++a<l;)e=u,u=o,o=n[a],r.push([i*(o[0]-e[0]),i*(o[1]-e[1])]);return r}function zu(n){if(n.length<3)return xu(n);var t=1,e=n.length,r=n[0],i=r[0],u=r[1],o=[i,i,i,(r=n[1])[0]],a=[u,u,u,r[1]],l=[i,",",u,"L",Ru(Pl,o),",",Ru(Pl,a)];for(n.push(n[e-1]);++t<=e;)r=n[t],o.shift(),o.push(r[0]),a.shift(),a.push(r[1]),Du(l,o,a);return n.pop(),l.push("L",r),l.join("")}function Lu(n){if(n.length<4)return xu(n);for(var t,e=[],r=-1,i=n.length,u=[0],o=[0];++r<3;)t=n[r],u.push(t[0]),o.push(t[1]);for(e.push(Ru(Pl,u)+","+Ru(Pl,o)),--r;++r<i;)t=n[r],u.shift(),u.push(t[0]),o.shift(),o.push(t[1]),Du(e,u,o);return e.join("")}function qu(n){for(var t,e,r=-1,i=n.length,u=i+4,o=[],a=[];++r<4;)e=n[r%i],o.push(e[0]),a.push(e[1]);for(t=[Ru(Pl,o),",",Ru(Pl,a)],--r;++r<u;)e=n[r%i],o.shift(),o.push(e[0]),a.shift(),a.push(e[1]),Du(t,o,a);return t.join("")}function Tu(n,t){var e=n.length-1;if(e)for(var r,i,u=n[0][0],o=n[0][1],a=n[e][0]-u,l=n[e][1]-o,c=-1;++c<=e;)r=n[c],i=c/e,r[0]=t*r[0]+(1-t)*(u+i*a),r[1]=t*r[1]+(1-t)*(o+i*l);return zu(n)}function Ru(n,t){return n[0]*t[0]+n[1]*t[1]+n[2]*t[2]+n[3]*t[3]}function Du(n,t,e){n.push("C",Ru(Rl,t),",",Ru(Rl,e),",",Ru(Dl,t),",",Ru(Dl,e),",",Ru(Pl,t),",",Ru(Pl,e))}function Pu(n,t){return(t[1]-n[1])/(t[0]-n[0])}function Uu(n){for(var t=0,e=n.length-1,r=[],i=n[0],u=n[1],o=r[0]=Pu(i,u);++t<e;)r[t]=(o+(o=Pu(i=u,u=n[t+1])))/2;return r[t]=o,r}function ju(n){for(var t,e,r,i,u=[],o=Uu(n),a=-1,l=n.length-1;++a<l;)t=Pu(n[a],n[a+1]),xo(t)<Uo?o[a]=o[a+1]=0:(e=o[a]/t,r=o[a+1]/t,i=e*e+r*r,i>9&&(i=3*t/Math.sqrt(i),o[a]=i*e,o[a+1]=i*r));for(a=-1;++a<=l;)i=(n[Math.min(l,a+1)][0]-n[Math.max(0,a-1)][0])/(6*(1+o[a]*o[a])),u.push([i||0,o[a]*i||0]);return u}function Fu(n){return n.length<3?xu(n):n[0]+Au(n,ju(n))}function Hu(n){for(var t,e,r,i=-1,u=n.length;++i<u;)t=n[i],e=t[0],r=t[1]-Io,t[0]=e*Math.cos(r),t[1]=e*Math.sin(r);return n}function Ou(n){function t(t){function l(){v.push("M",a(n(y),s),f,c(n(d.reverse()),s),"Z")}for(var h,p,g,v=[],d=[],y=[],m=-1,M=t.length,x=En(e),b=En(i),_=e===r?function(){
return p}:En(r),w=i===u?function(){return g}:En(u);++m<M;)o.call(this,h=t[m],m)?(d.push([p=+x.call(this,h,m),g=+b.call(this,h,m)]),y.push([+_.call(this,h,m),+w.call(this,h,m)])):d.length&&(l(),d=[],y=[]);return d.length&&l(),v.length?v.join(""):null}var e=Ce,r=Ce,i=0,u=ze,o=zt,a=xu,l=a.key,c=a,f="L",s=.7;return t.x=function(n){return arguments.length?(e=r=n,t):r},t.x0=function(n){return arguments.length?(e=n,t):e},t.x1=function(n){return arguments.length?(r=n,t):r},t.y=function(n){return arguments.length?(i=u=n,t):u},t.y0=function(n){return arguments.length?(i=n,t):i},t.y1=function(n){return arguments.length?(u=n,t):u},t.defined=function(n){return arguments.length?(o=n,t):o},t.interpolate=function(n){return arguments.length?(l="function"==typeof n?a=n:(a=Tl.get(n)||xu).key,c=a.reverse||a,f=a.closed?"M":"L",t):l},t.tension=function(n){return arguments.length?(s=n,t):s},t}function Iu(n){return n.radius}function Yu(n){return[n.x,n.y]}function Zu(n){return function(){var t=n.apply(this,arguments),e=t[0],r=t[1]-Io;return[e*Math.cos(r),e*Math.sin(r)]}}function Vu(){return 64}function Xu(){return"circle"}function $u(n){var t=Math.sqrt(n/Fo);return"M0,"+t+"A"+t+","+t+" 0 1,1 0,"+-t+"A"+t+","+t+" 0 1,1 0,"+t+"Z"}function Bu(n){return function(){var t,e,r;(t=this[n])&&(r=t[e=t.active])&&(r.timer.c=null,r.timer.t=NaN,--t.count?delete t[e]:delete this[n],t.active+=.5,r.event&&r.event.interrupt.call(this,this.__data__,r.index))}}function Wu(n,t,e){return ko(n,Yl),n.namespace=t,n.id=e,n}function Ju(n,t,e,r){var i=n.id,u=n.namespace;return Y(n,"function"==typeof e?function(n,o,a){n[u][i].tween.set(t,r(e.call(n,n.__data__,o,a)))}:(e=r(e),function(n){n[u][i].tween.set(t,e)}))}function Gu(n){return null==n&&(n=""),function(){this.textContent=n}}function Ku(n){return null==n?"__transition__":"__transition_"+n+"__"}function Qu(n,t,e,r,i){function u(n){var t=v.delay;return f.t=t+l,n>=t?o(n-t):void(f.c=o)}function o(e){var i=g.active,u=g[i];u&&(u.timer.c=null,u.timer.t=NaN,--g.count,delete g[i],u.event&&u.event.interrupt.call(n,n.__data__,u.index));for(var o in g)if(r>+o){var c=g[o];c.timer.c=null,c.timer.t=NaN,--g.count,delete g[o]}f.c=a,qn(function(){return f.c&&a(e||1)&&(f.c=null,f.t=NaN),1},0,l),g.active=r,v.event&&v.event.start.call(n,n.__data__,t),p=[],v.tween.forEach(function(e,r){(r=r.call(n,n.__data__,t))&&p.push(r)}),h=v.ease,s=v.duration}function a(i){for(var u=i/s,o=h(u),a=p.length;a>0;)p[--a].call(n,o);return u>=1?(v.event&&v.event.end.call(n,n.__data__,t),--g.count?delete g[r]:delete n[e],1):void 0}var l,f,s,h,p,g=n[e]||(n[e]={active:0,count:0}),v=g[r];v||(l=i.time,f=qn(u,0,l),v=g[r]={tween:new c,time:l,timer:f,delay:i.delay,duration:i.duration,ease:i.ease,index:t},i=null,++g.count)}function no(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate("+(isFinite(r)?r:e(n))+",0)"})}function to(n,t,e){n.attr("transform",function(n){var r=t(n);return"translate(0,"+(isFinite(r)?r:e(n))+")"})}function eo(n){return n.toISOString()}function ro(n,t,e){function r(t){return n(t)}function i(n,e){var r=n[1]-n[0],i=r/e,u=ao.bisect(Kl,i);return u==Kl.length?[t.year,Ki(n.map(function(n){return n/31536e6}),e)[2]]:u?t[i/Kl[u-1]<Kl[u]/i?u-1:u]:[tc,Ki(n,e)[2]]}return r.invert=function(t){return io(n.invert(t))},r.domain=function(t){return arguments.length?(n.domain(t),r):n.domain().map(io)},r.nice=function(n,t){function e(e){return!isNaN(e)&&!n.range(e,io(+e+1),t).length}var u=r.domain(),o=Yi(u),a=null==n?i(o,10):"number"==typeof n&&i(o,n);return a&&(n=a[0],t=a[1]),r.domain(Xi(u,t>1?{floor:function(t){for(;e(t=n.floor(t));)t=io(t-1);return t},ceil:function(t){for(;e(t=n.ceil(t));)t=io(+t+1);return t}}:n))},r.ticks=function(n,t){var e=Yi(r.domain()),u=null==n?i(e,10):"number"==typeof n?i(e,n):!n.range&&[{range:n},t];return u&&(n=u[0],t=u[1]),n.range(e[0],io(+e[1]+1),1>t?1:t)},r.tickFormat=function(){return e},r.copy=function(){return ro(n.copy(),t,e)},Ji(r,n)}function io(n){return new Date(n)}function uo(n){return JSON.parse(n.responseText)}function oo(n){var t=fo.createRange();return t.selectNode(fo.body),t.createContextualFragment(n.responseText)}var ao={version:"3.5.17"},lo=[].slice,co=function(n){return lo.call(n)},fo=this.document;if(fo)try{co(fo.documentElement.childNodes)[0].nodeType}catch(so){co=function(n){for(var t=n.length,e=new Array(t);t--;)e[t]=n[t];return e}}if(Date.now||(Date.now=function(){return+new Date}),fo)try{fo.createElement("DIV").style.setProperty("opacity",0,"")}catch(ho){var po=this.Element.prototype,go=po.setAttribute,vo=po.setAttributeNS,yo=this.CSSStyleDeclaration.prototype,mo=yo.setProperty;po.setAttribute=function(n,t){go.call(this,n,t+"")},po.setAttributeNS=function(n,t,e){vo.call(this,n,t,e+"")},yo.setProperty=function(n,t,e){mo.call(this,n,t+"",e)}}ao.ascending=e,ao.descending=function(n,t){return n>t?-1:t>n?1:t>=n?0:NaN},ao.min=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u;)if(null!=(r=n[i])&&r>=r){e=r;break}for(;++i<u;)null!=(r=n[i])&&e>r&&(e=r)}else{for(;++i<u;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}for(;++i<u;)null!=(r=t.call(n,n[i],i))&&e>r&&(e=r)}return e},ao.max=function(n,t){var e,r,i=-1,u=n.length;if(1===arguments.length){for(;++i<u;)if(null!=(r=n[i])&&r>=r){e=r;break}for(;++i<u;)null!=(r=n[i])&&r>e&&(e=r)}else{for(;++i<u;)if(null!=(r=t.call(n,n[i],i))&&r>=r){e=r;break}for(;++i<u;)null!=(r=t.call(n,n[i],i))&&r>e&&(e=r)}return e},ao.extent=function(n,t){var e,r,i,u=-1,o=n.length;if(1===arguments.length){for(;++u<o;)if(null!=(r=n[u])&&r>=r){e=i=r;break}for(;++u<o;)null!=(r=n[u])&&(e>r&&(e=r),r>i&&(i=r))}else{for(;++u<o;)if(null!=(r=t.call(n,n[u],u))&&r>=r){e=i=r;break}for(;++u<o;)null!=(r=t.call(n,n[u],u))&&(e>r&&(e=r),r>i&&(i=r))}return[e,i]},ao.sum=function(n,t){var e,r=0,u=n.length,o=-1;if(1===arguments.length)for(;++o<u;)i(e=+n[o])&&(r+=e);else for(;++o<u;)i(e=+t.call(n,n[o],o))&&(r+=e);return r},ao.mean=function(n,t){var e,u=0,o=n.length,a=-1,l=o;if(1===arguments.length)for(;++a<o;)i(e=r(n[a]))?u+=e:--l;else for(;++a<o;)i(e=r(t.call(n,n[a],a)))?u+=e:--l;return l?u/l:void 0},ao.quantile=function(n,t){var e=(n.length-1)*t+1,r=Math.floor(e),i=+n[r-1],u=e-r;return u?i+u*(n[r]-i):i},ao.median=function(n,t){var u,o=[],a=n.length,l=-1;if(1===arguments.length)for(;++l<a;)i(u=r(n[l]))&&o.push(u);else for(;++l<a;)i(u=r(t.call(n,n[l],l)))&&o.push(u);return o.length?ao.quantile(o.sort(e),.5):void 0},ao.variance=function(n,t){var e,u,o=n.length,a=0,l=0,c=-1,f=0;if(1===arguments.length)for(;++c<o;)i(e=r(n[c]))&&(u=e-a,a+=u/++f,l+=u*(e-a));else for(;++c<o;)i(e=r(t.call(n,n[c],c)))&&(u=e-a,a+=u/++f,l+=u*(e-a));return f>1?l/(f-1):void 0},ao.deviation=function(){var n=ao.variance.apply(this,arguments);return n?Math.sqrt(n):n};var Mo=u(e);ao.bisectLeft=Mo.left,ao.bisect=ao.bisectRight=Mo.right,ao.bisector=function(n){return u(1===n.length?function(t,r){return e(n(t),r)}:n)},ao.shuffle=function(n,t,e){(u=arguments.length)<3&&(e=n.length,2>u&&(t=0));for(var r,i,u=e-t;u;)i=Math.random()*u--|0,r=n[u+t],n[u+t]=n[i+t],n[i+t]=r;return n},ao.permute=function(n,t){for(var e=t.length,r=new Array(e);e--;)r[e]=n[t[e]];return r},ao.pairs=function(n){for(var t,e=0,r=n.length-1,i=n[0],u=new Array(0>r?0:r);r>e;)u[e]=[t=i,i=n[++e]];return u},ao.transpose=function(n){if(!(i=n.length))return[];for(var t=-1,e=ao.min(n,o),r=new Array(e);++t<e;)for(var i,u=-1,a=r[t]=new Array(i);++u<i;)a[u]=n[u][t];return r},ao.zip=function(){return ao.transpose(arguments)},ao.keys=function(n){var t=[];for(var e in n)t.push(e);return t},ao.values=function(n){var t=[];for(var e in n)t.push(n[e]);return t},ao.entries=function(n){var t=[];for(var e in n)t.push({key:e,value:n[e]});return t},ao.merge=function(n){for(var t,e,r,i=n.length,u=-1,o=0;++u<i;)o+=n[u].length;for(e=new Array(o);--i>=0;)for(r=n[i],t=r.length;--t>=0;)e[--o]=r[t];return e};var xo=Math.abs;ao.range=function(n,t,e){if(arguments.length<3&&(e=1,arguments.length<2&&(t=n,n=0)),(t-n)/e===1/0)throw new Error("infinite range");var r,i=[],u=a(xo(e)),o=-1;if(n*=u,t*=u,e*=u,0>e)for(;(r=n+e*++o)>t;)i.push(r/u);else for(;(r=n+e*++o)<t;)i.push(r/u);return i},ao.map=function(n,t){var e=new c;if(n instanceof c)n.forEach(function(n,t){e.set(n,t)});else if(Array.isArray(n)){var r,i=-1,u=n.length;if(1===arguments.length)for(;++i<u;)e.set(i,n[i]);else for(;++i<u;)e.set(t.call(n,r=n[i],i),r)}else for(var o in n)e.set(o,n[o]);return e};var bo="__proto__",_o="\x00";l(c,{has:h,get:function(n){return this._[f(n)]},set:function(n,t){return this._[f(n)]=t},remove:p,keys:g,values:function(){var n=[];for(var t in this._)n.push(this._[t]);return n},entries:function(){var n=[];for(var t in this._)n.push({key:s(t),value:this._[t]});return n},size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,s(t),this._[t])}}),ao.nest=function(){function n(t,o,a){if(a>=u.length)return r?r.call(i,o):e?o.sort(e):o;for(var l,f,s,h,p=-1,g=o.length,v=u[a++],d=new c;++p<g;)(h=d.get(l=v(f=o[p])))?h.push(f):d.set(l,[f]);return t?(f=t(),s=function(e,r){f.set(e,n(t,r,a))}):(f={},s=function(e,r){f[e]=n(t,r,a)}),d.forEach(s),f}function t(n,e){if(e>=u.length)return n;var r=[],i=o[e++];return n.forEach(function(n,i){r.push({key:n,values:t(i,e)})}),i?r.sort(function(n,t){return i(n.key,t.key)}):r}var e,r,i={},u=[],o=[];return i.map=function(t,e){return n(e,t,0)},i.entries=function(e){return t(n(ao.map,e,0),0)},i.key=function(n){return u.push(n),i},i.sortKeys=function(n){return o[u.length-1]=n,i},i.sortValues=function(n){return e=n,i},i.rollup=function(n){return r=n,i},i},ao.set=function(n){var t=new y;if(n)for(var e=0,r=n.length;r>e;++e)t.add(n[e]);return t},l(y,{has:h,add:function(n){return this._[f(n+="")]=!0,n},remove:p,values:g,size:v,empty:d,forEach:function(n){for(var t in this._)n.call(this,s(t))}}),ao.behavior={},ao.rebind=function(n,t){for(var e,r=1,i=arguments.length;++r<i;)n[e=arguments[r]]=M(n,t,t[e]);return n};var wo=["webkit","ms","moz","Moz","o","O"];ao.dispatch=function(){for(var n=new _,t=-1,e=arguments.length;++t<e;)n[arguments[t]]=w(n);return n},_.prototype.on=function(n,t){var e=n.indexOf("."),r="";if(e>=0&&(r=n.slice(e+1),n=n.slice(0,e)),n)return arguments.length<2?this[n].on(r):this[n].on(r,t);if(2===arguments.length){if(null==t)for(n in this)this.hasOwnProperty(n)&&this[n].on(r,null);return this}},ao.event=null,ao.requote=function(n){return n.replace(So,"\\$&")};var So=/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g,ko={}.__proto__?function(n,t){n.__proto__=t}:function(n,t){for(var e in t)n[e]=t[e]},No=function(n,t){return t.querySelector(n)},Eo=function(n,t){return t.querySelectorAll(n)},Ao=function(n,t){var e=n.matches||n[x(n,"matchesSelector")];return(Ao=function(n,t){return e.call(n,t)})(n,t)};"function"==typeof Sizzle&&(No=function(n,t){return Sizzle(n,t)[0]||null},Eo=Sizzle,Ao=Sizzle.matchesSelector),ao.selection=function(){return ao.select(fo.documentElement)};var Co=ao.selection.prototype=[];Co.select=function(n){var t,e,r,i,u=[];n=A(n);for(var o=-1,a=this.length;++o<a;){u.push(t=[]),t.parentNode=(r=this[o]).parentNode;for(var l=-1,c=r.length;++l<c;)(i=r[l])?(t.push(e=n.call(i,i.__data__,l,o)),e&&"__data__"in i&&(e.__data__=i.__data__)):t.push(null)}return E(u)},Co.selectAll=function(n){var t,e,r=[];n=C(n);for(var i=-1,u=this.length;++i<u;)for(var o=this[i],a=-1,l=o.length;++a<l;)(e=o[a])&&(r.push(t=co(n.call(e,e.__data__,a,i))),t.parentNode=e);return E(r)};var zo="http://www.w3.org/1999/xhtml",Lo={svg:"http://www.w3.org/2000/svg",xhtml:zo,xlink:"http://www.w3.org/1999/xlink",xml:"http://www.w3.org/XML/1998/namespace",xmlns:"http://www.w3.org/2000/xmlns/"};ao.ns={prefix:Lo,qualify:function(n){var t=n.indexOf(":"),e=n;return t>=0&&"xmlns"!==(e=n.slice(0,t))&&(n=n.slice(t+1)),Lo.hasOwnProperty(e)?{space:Lo[e],local:n}:n}},Co.attr=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node();return n=ao.ns.qualify(n),n.local?e.getAttributeNS(n.space,n.local):e.getAttribute(n)}for(t in n)this.each(z(t,n[t]));return this}return this.each(z(n,t))},Co.classed=function(n,t){if(arguments.length<2){if("string"==typeof n){var e=this.node(),r=(n=T(n)).length,i=-1;if(t=e.classList){for(;++i<r;)if(!t.contains(n[i]))return!1}else for(t=e.getAttribute("class");++i<r;)if(!q(n[i]).test(t))return!1;return!0}for(t in n)this.each(R(t,n[t]));return this}return this.each(R(n,t))},Co.style=function(n,e,r){var i=arguments.length;if(3>i){if("string"!=typeof n){2>i&&(e="");for(r in n)this.each(P(r,n[r],e));return this}if(2>i){var u=this.node();return t(u).getComputedStyle(u,null).getPropertyValue(n)}r=""}return this.each(P(n,e,r))},Co.property=function(n,t){if(arguments.length<2){if("string"==typeof n)return this.node()[n];for(t in n)this.each(U(t,n[t]));return this}return this.each(U(n,t))},Co.text=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.textContent=null==t?"":t}:null==n?function(){this.textContent=""}:function(){this.textContent=n}):this.node().textContent},Co.html=function(n){return arguments.length?this.each("function"==typeof n?function(){var t=n.apply(this,arguments);this.innerHTML=null==t?"":t}:null==n?function(){this.innerHTML=""}:function(){this.innerHTML=n}):this.node().innerHTML},Co.append=function(n){return n=j(n),this.select(function(){return this.appendChild(n.apply(this,arguments))})},Co.insert=function(n,t){return n=j(n),t=A(t),this.select(function(){return this.insertBefore(n.apply(this,arguments),t.apply(this,arguments)||null)})},Co.remove=function(){return this.each(F)},Co.data=function(n,t){function e(n,e){var r,i,u,o=n.length,s=e.length,h=Math.min(o,s),p=new Array(s),g=new Array(s),v=new Array(o);if(t){var d,y=new c,m=new Array(o);for(r=-1;++r<o;)(i=n[r])&&(y.has(d=t.call(i,i.__data__,r))?v[r]=i:y.set(d,i),m[r]=d);for(r=-1;++r<s;)(i=y.get(d=t.call(e,u=e[r],r)))?i!==!0&&(p[r]=i,i.__data__=u):g[r]=H(u),y.set(d,!0);for(r=-1;++r<o;)r in m&&y.get(m[r])!==!0&&(v[r]=n[r])}else{for(r=-1;++r<h;)i=n[r],u=e[r],i?(i.__data__=u,p[r]=i):g[r]=H(u);for(;s>r;++r)g[r]=H(e[r]);for(;o>r;++r)v[r]=n[r]}g.update=p,g.parentNode=p.parentNode=v.parentNode=n.parentNode,a.push(g),l.push(p),f.push(v)}var r,i,u=-1,o=this.length;if(!arguments.length){for(n=new Array(o=(r=this[0]).length);++u<o;)(i=r[u])&&(n[u]=i.__data__);return n}var a=Z([]),l=E([]),f=E([]);if("function"==typeof n)for(;++u<o;)e(r=this[u],n.call(r,r.parentNode.__data__,u));else for(;++u<o;)e(r=this[u],n);return l.enter=function(){return a},l.exit=function(){return f},l},Co.datum=function(n){return arguments.length?this.property("__data__",n):this.property("__data__")},Co.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=O(n));for(var u=0,o=this.length;o>u;u++){i.push(t=[]),t.parentNode=(e=this[u]).parentNode;for(var a=0,l=e.length;l>a;a++)(r=e[a])&&n.call(r,r.__data__,a,u)&&t.push(r)}return E(i)},Co.order=function(){for(var n=-1,t=this.length;++n<t;)for(var e,r=this[n],i=r.length-1,u=r[i];--i>=0;)(e=r[i])&&(u&&u!==e.nextSibling&&u.parentNode.insertBefore(e,u),u=e);return this},Co.sort=function(n){n=I.apply(this,arguments);for(var t=-1,e=this.length;++t<e;)this[t].sort(n);return this.order()},Co.each=function(n){return Y(this,function(t,e,r){n.call(t,t.__data__,e,r)})},Co.call=function(n){var t=co(arguments);return n.apply(t[0]=this,t),this},Co.empty=function(){return!this.node()},Co.node=function(){for(var n=0,t=this.length;t>n;n++)for(var e=this[n],r=0,i=e.length;i>r;r++){var u=e[r];if(u)return u}return null},Co.size=function(){var n=0;return Y(this,function(){++n}),n};var qo=[];ao.selection.enter=Z,ao.selection.enter.prototype=qo,qo.append=Co.append,qo.empty=Co.empty,qo.node=Co.node,qo.call=Co.call,qo.size=Co.size,qo.select=function(n){for(var t,e,r,i,u,o=[],a=-1,l=this.length;++a<l;){r=(i=this[a]).update,o.push(t=[]),t.parentNode=i.parentNode;for(var c=-1,f=i.length;++c<f;)(u=i[c])?(t.push(r[c]=e=n.call(i.parentNode,u.__data__,c,a)),e.__data__=u.__data__):t.push(null)}return E(o)},qo.insert=function(n,t){return arguments.length<2&&(t=V(this)),Co.insert.call(this,n,t)},ao.select=function(t){var e;return"string"==typeof t?(e=[No(t,fo)],e.parentNode=fo.documentElement):(e=[t],e.parentNode=n(t)),E([e])},ao.selectAll=function(n){var t;return"string"==typeof n?(t=co(Eo(n,fo)),t.parentNode=fo.documentElement):(t=co(n),t.parentNode=null),E([t])},Co.on=function(n,t,e){var r=arguments.length;if(3>r){if("string"!=typeof n){2>r&&(t=!1);for(e in n)this.each(X(e,n[e],t));return this}if(2>r)return(r=this.node()["__on"+n])&&r._;e=!1}return this.each(X(n,t,e))};var To=ao.map({mouseenter:"mouseover",mouseleave:"mouseout"});fo&&To.forEach(function(n){"on"+n in fo&&To.remove(n)});var Ro,Do=0;ao.mouse=function(n){return J(n,k())};var Po=this.navigator&&/WebKit/.test(this.navigator.userAgent)?-1:0;ao.touch=function(n,t,e){if(arguments.length<3&&(e=t,t=k().changedTouches),t)for(var r,i=0,u=t.length;u>i;++i)if((r=t[i]).identifier===e)return J(n,r)},ao.behavior.drag=function(){function n(){this.on("mousedown.drag",u).on("touchstart.drag",o)}function e(n,t,e,u,o){return function(){function a(){var n,e,r=t(h,v);r&&(n=r[0]-M[0],e=r[1]-M[1],g|=n|e,M=r,p({type:"drag",x:r[0]+c[0],y:r[1]+c[1],dx:n,dy:e}))}function l(){t(h,v)&&(y.on(u+d,null).on(o+d,null),m(g),p({type:"dragend"}))}var c,f=this,s=ao.event.target.correspondingElement||ao.event.target,h=f.parentNode,p=r.of(f,arguments),g=0,v=n(),d=".drag"+(null==v?"":"-"+v),y=ao.select(e(s)).on(u+d,a).on(o+d,l),m=W(s),M=t(h,v);i?(c=i.apply(f,arguments),c=[c.x-M[0],c.y-M[1]]):c=[0,0],p({type:"dragstart"})}}var r=N(n,"drag","dragstart","dragend"),i=null,u=e(b,ao.mouse,t,"mousemove","mouseup"),o=e(G,ao.touch,m,"touchmove","touchend");return n.origin=function(t){return arguments.length?(i=t,n):i},ao.rebind(n,r,"on")},ao.touches=function(n,t){return arguments.length<2&&(t=k().touches),t?co(t).map(function(t){var e=J(n,t);return e.identifier=t.identifier,e}):[]};var Uo=1e-6,jo=Uo*Uo,Fo=Math.PI,Ho=2*Fo,Oo=Ho-Uo,Io=Fo/2,Yo=Fo/180,Zo=180/Fo,Vo=Math.SQRT2,Xo=2,$o=4;ao.interpolateZoom=function(n,t){var e,r,i=n[0],u=n[1],o=n[2],a=t[0],l=t[1],c=t[2],f=a-i,s=l-u,h=f*f+s*s;if(jo>h)r=Math.log(c/o)/Vo,e=function(n){return[i+n*f,u+n*s,o*Math.exp(Vo*n*r)]};else{var p=Math.sqrt(h),g=(c*c-o*o+$o*h)/(2*o*Xo*p),v=(c*c-o*o-$o*h)/(2*c*Xo*p),d=Math.log(Math.sqrt(g*g+1)-g),y=Math.log(Math.sqrt(v*v+1)-v);r=(y-d)/Vo,e=function(n){var t=n*r,e=rn(d),a=o/(Xo*p)*(e*un(Vo*t+d)-en(d));return[i+a*f,u+a*s,o*e/rn(Vo*t+d)]}}return e.duration=1e3*r,e},ao.behavior.zoom=function(){function n(n){n.on(L,s).on(Wo+".zoom",p).on("dblclick.zoom",g).on(R,h)}function e(n){return[(n[0]-k.x)/k.k,(n[1]-k.y)/k.k]}function r(n){return[n[0]*k.k+k.x,n[1]*k.k+k.y]}function i(n){k.k=Math.max(A[0],Math.min(A[1],n))}function u(n,t){t=r(t),k.x+=n[0]-t[0],k.y+=n[1]-t[1]}function o(t,e,r,o){t.__chart__={x:k.x,y:k.y,k:k.k},i(Math.pow(2,o)),u(d=e,r),t=ao.select(t),C>0&&(t=t.transition().duration(C)),t.call(n.event)}function a(){b&&b.domain(x.range().map(function(n){return(n-k.x)/k.k}).map(x.invert)),w&&w.domain(_.range().map(function(n){return(n-k.y)/k.k}).map(_.invert))}function l(n){z++||n({type:"zoomstart"})}function c(n){a(),n({type:"zoom",scale:k.k,translate:[k.x,k.y]})}function f(n){--z||(n({type:"zoomend"}),d=null)}function s(){function n(){a=1,u(ao.mouse(i),h),c(o)}function r(){s.on(q,null).on(T,null),p(a),f(o)}var i=this,o=D.of(i,arguments),a=0,s=ao.select(t(i)).on(q,n).on(T,r),h=e(ao.mouse(i)),p=W(i);Il.call(i),l(o)}function h(){function n(){var n=ao.touches(g);return p=k.k,n.forEach(function(n){n.identifier in d&&(d[n.identifier]=e(n))}),n}function t(){var t=ao.event.target;ao.select(t).on(x,r).on(b,a),_.push(t);for(var e=ao.event.changedTouches,i=0,u=e.length;u>i;++i)d[e[i].identifier]=null;var l=n(),c=Date.now();if(1===l.length){if(500>c-M){var f=l[0];o(g,f,d[f.identifier],Math.floor(Math.log(k.k)/Math.LN2)+1),S()}M=c}else if(l.length>1){var f=l[0],s=l[1],h=f[0]-s[0],p=f[1]-s[1];y=h*h+p*p}}function r(){var n,t,e,r,o=ao.touches(g);Il.call(g);for(var a=0,l=o.length;l>a;++a,r=null)if(e=o[a],r=d[e.identifier]){if(t)break;n=e,t=r}if(r){var f=(f=e[0]-n[0])*f+(f=e[1]-n[1])*f,s=y&&Math.sqrt(f/y);n=[(n[0]+e[0])/2,(n[1]+e[1])/2],t=[(t[0]+r[0])/2,(t[1]+r[1])/2],i(s*p)}M=null,u(n,t),c(v)}function a(){if(ao.event.touches.length){for(var t=ao.event.changedTouches,e=0,r=t.length;r>e;++e)delete d[t[e].identifier];for(var i in d)return void n()}ao.selectAll(_).on(m,null),w.on(L,s).on(R,h),N(),f(v)}var p,g=this,v=D.of(g,arguments),d={},y=0,m=".zoom-"+ao.event.changedTouches[0].identifier,x="touchmove"+m,b="touchend"+m,_=[],w=ao.select(g),N=W(g);t(),l(v),w.on(L,null).on(R,t)}function p(){var n=D.of(this,arguments);m?clearTimeout(m):(Il.call(this),v=e(d=y||ao.mouse(this)),l(n)),m=setTimeout(function(){m=null,f(n)},50),S(),i(Math.pow(2,.002*Bo())*k.k),u(d,v),c(n)}function g(){var n=ao.mouse(this),t=Math.log(k.k)/Math.LN2;o(this,n,e(n),ao.event.shiftKey?Math.ceil(t)-1:Math.floor(t)+1)}var v,d,y,m,M,x,b,_,w,k={x:0,y:0,k:1},E=[960,500],A=Jo,C=250,z=0,L="mousedown.zoom",q="mousemove.zoom",T="mouseup.zoom",R="touchstart.zoom",D=N(n,"zoomstart","zoom","zoomend");return Wo||(Wo="onwheel"in fo?(Bo=function(){return-ao.event.deltaY*(ao.event.deltaMode?120:1)},"wheel"):"onmousewheel"in fo?(Bo=function(){return ao.event.wheelDelta},"mousewheel"):(Bo=function(){return-ao.event.detail},"MozMousePixelScroll")),n.event=function(n){n.each(function(){var n=D.of(this,arguments),t=k;Hl?ao.select(this).transition().each("start.zoom",function(){k=this.__chart__||{x:0,y:0,k:1},l(n)}).tween("zoom:zoom",function(){var e=E[0],r=E[1],i=d?d[0]:e/2,u=d?d[1]:r/2,o=ao.interpolateZoom([(i-k.x)/k.k,(u-k.y)/k.k,e/k.k],[(i-t.x)/t.k,(u-t.y)/t.k,e/t.k]);return function(t){var r=o(t),a=e/r[2];this.__chart__=k={x:i-r[0]*a,y:u-r[1]*a,k:a},c(n)}}).each("interrupt.zoom",function(){f(n)}).each("end.zoom",function(){f(n)}):(this.__chart__=k,l(n),c(n),f(n))})},n.translate=function(t){return arguments.length?(k={x:+t[0],y:+t[1],k:k.k},a(),n):[k.x,k.y]},n.scale=function(t){return arguments.length?(k={x:k.x,y:k.y,k:null},i(+t),a(),n):k.k},n.scaleExtent=function(t){return arguments.length?(A=null==t?Jo:[+t[0],+t[1]],n):A},n.center=function(t){return arguments.length?(y=t&&[+t[0],+t[1]],n):y},n.size=function(t){return arguments.length?(E=t&&[+t[0],+t[1]],n):E},n.duration=function(t){return arguments.length?(C=+t,n):C},n.x=function(t){return arguments.length?(b=t,x=t.copy(),k={x:0,y:0,k:1},n):b},n.y=function(t){return arguments.length?(w=t,_=t.copy(),k={x:0,y:0,k:1},n):w},ao.rebind(n,D,"on")};var Bo,Wo,Jo=[0,1/0];ao.color=an,an.prototype.toString=function(){return this.rgb()+""},ao.hsl=ln;var Go=ln.prototype=new an;Go.brighter=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,this.l/n)},Go.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new ln(this.h,this.s,n*this.l)},Go.rgb=function(){return cn(this.h,this.s,this.l)},ao.hcl=fn;var Ko=fn.prototype=new an;Ko.brighter=function(n){return new fn(this.h,this.c,Math.min(100,this.l+Qo*(arguments.length?n:1)))},Ko.darker=function(n){return new fn(this.h,this.c,Math.max(0,this.l-Qo*(arguments.length?n:1)))},Ko.rgb=function(){return sn(this.h,this.c,this.l).rgb()},ao.lab=hn;var Qo=18,na=.95047,ta=1,ea=1.08883,ra=hn.prototype=new an;ra.brighter=function(n){return new hn(Math.min(100,this.l+Qo*(arguments.length?n:1)),this.a,this.b)},ra.darker=function(n){return new hn(Math.max(0,this.l-Qo*(arguments.length?n:1)),this.a,this.b)},ra.rgb=function(){return pn(this.l,this.a,this.b)},ao.rgb=mn;var ia=mn.prototype=new an;ia.brighter=function(n){n=Math.pow(.7,arguments.length?n:1);var t=this.r,e=this.g,r=this.b,i=30;return t||e||r?(t&&i>t&&(t=i),e&&i>e&&(e=i),r&&i>r&&(r=i),new mn(Math.min(255,t/n),Math.min(255,e/n),Math.min(255,r/n))):new mn(i,i,i)},ia.darker=function(n){return n=Math.pow(.7,arguments.length?n:1),new mn(n*this.r,n*this.g,n*this.b)},ia.hsl=function(){return wn(this.r,this.g,this.b)},ia.toString=function(){return"#"+bn(this.r)+bn(this.g)+bn(this.b)};var ua=ao.map({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});ua.forEach(function(n,t){ua.set(n,Mn(t))}),ao.functor=En,ao.xhr=An(m),ao.dsv=function(n,t){function e(n,e,u){arguments.length<3&&(u=e,e=null);var o=Cn(n,t,null==e?r:i(e),u);return o.row=function(n){return arguments.length?o.response(null==(e=n)?r:i(n)):e},o}function r(n){return e.parse(n.responseText)}function i(n){return function(t){return e.parse(t.responseText,n)}}function u(t){return t.map(o).join(n)}function o(n){return a.test(n)?'"'+n.replace(/\"/g,'""')+'"':n}var a=new RegExp('["'+n+"\n]"),l=n.charCodeAt(0);return e.parse=function(n,t){var r;return e.parseRows(n,function(n,e){if(r)return r(n,e-1);var i=new Function("d","return {"+n.map(function(n,t){return JSON.stringify(n)+": d["+t+"]"}).join(",")+"}");r=t?function(n,e){return t(i(n),e)}:i})},e.parseRows=function(n,t){function e(){if(f>=c)return o;if(i)return i=!1,u;var t=f;if(34===n.charCodeAt(t)){for(var e=t;e++<c;)if(34===n.charCodeAt(e)){if(34!==n.charCodeAt(e+1))break;++e}f=e+2;var r=n.charCodeAt(e+1);return 13===r?(i=!0,10===n.charCodeAt(e+2)&&++f):10===r&&(i=!0),n.slice(t+1,e).replace(/""/g,'"')}for(;c>f;){var r=n.charCodeAt(f++),a=1;if(10===r)i=!0;else if(13===r)i=!0,10===n.charCodeAt(f)&&(++f,++a);else if(r!==l)continue;return n.slice(t,f-a)}return n.slice(t)}for(var r,i,u={},o={},a=[],c=n.length,f=0,s=0;(r=e())!==o;){for(var h=[];r!==u&&r!==o;)h.push(r),r=e();t&&null==(h=t(h,s++))||a.push(h)}return a},e.format=function(t){if(Array.isArray(t[0]))return e.formatRows(t);var r=new y,i=[];return t.forEach(function(n){for(var t in n)r.has(t)||i.push(r.add(t))}),[i.map(o).join(n)].concat(t.map(function(t){return i.map(function(n){return o(t[n])}).join(n)})).join("\n")},e.formatRows=function(n){return n.map(u).join("\n")},e},ao.csv=ao.dsv(",","text/csv"),ao.tsv=ao.dsv("	","text/tab-separated-values");var oa,aa,la,ca,fa=this[x(this,"requestAnimationFrame")]||function(n){setTimeout(n,17)};ao.timer=function(){qn.apply(this,arguments)},ao.timer.flush=function(){Rn(),Dn()},ao.round=function(n,t){return t?Math.round(n*(t=Math.pow(10,t)))/t:Math.round(n)};var sa=["y","z","a","f","p","n","\xb5","m","","k","M","G","T","P","E","Z","Y"].map(Un);ao.formatPrefix=function(n,t){var e=0;return(n=+n)&&(0>n&&(n*=-1),t&&(n=ao.round(n,Pn(n,t))),e=1+Math.floor(1e-12+Math.log(n)/Math.LN10),e=Math.max(-24,Math.min(24,3*Math.floor((e-1)/3)))),sa[8+e/3]};var ha=/(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i,pa=ao.map({b:function(n){return n.toString(2)},c:function(n){return String.fromCharCode(n)},o:function(n){return n.toString(8)},x:function(n){return n.toString(16)},X:function(n){return n.toString(16).toUpperCase()},g:function(n,t){return n.toPrecision(t)},e:function(n,t){return n.toExponential(t)},f:function(n,t){return n.toFixed(t)},r:function(n,t){return(n=ao.round(n,Pn(n,t))).toFixed(Math.max(0,Math.min(20,Pn(n*(1+1e-15),t))))}}),ga=ao.time={},va=Date;Hn.prototype={getDate:function(){return this._.getUTCDate()},getDay:function(){return this._.getUTCDay()},getFullYear:function(){return this._.getUTCFullYear()},getHours:function(){return this._.getUTCHours()},getMilliseconds:function(){return this._.getUTCMilliseconds()},getMinutes:function(){return this._.getUTCMinutes()},getMonth:function(){return this._.getUTCMonth()},getSeconds:function(){return this._.getUTCSeconds()},getTime:function(){return this._.getTime()},getTimezoneOffset:function(){return 0},valueOf:function(){return this._.valueOf()},setDate:function(){da.setUTCDate.apply(this._,arguments)},setDay:function(){da.setUTCDay.apply(this._,arguments)},setFullYear:function(){da.setUTCFullYear.apply(this._,arguments)},setHours:function(){da.setUTCHours.apply(this._,arguments)},setMilliseconds:function(){da.setUTCMilliseconds.apply(this._,arguments)},setMinutes:function(){da.setUTCMinutes.apply(this._,arguments)},setMonth:function(){da.setUTCMonth.apply(this._,arguments)},setSeconds:function(){da.setUTCSeconds.apply(this._,arguments)},setTime:function(){da.setTime.apply(this._,arguments)}};var da=Date.prototype;ga.year=On(function(n){return n=ga.day(n),n.setMonth(0,1),n},function(n,t){n.setFullYear(n.getFullYear()+t)},function(n){return n.getFullYear()}),ga.years=ga.year.range,ga.years.utc=ga.year.utc.range,ga.day=On(function(n){var t=new va(2e3,0);return t.setFullYear(n.getFullYear(),n.getMonth(),n.getDate()),t},function(n,t){n.setDate(n.getDate()+t)},function(n){return n.getDate()-1}),ga.days=ga.day.range,ga.days.utc=ga.day.utc.range,ga.dayOfYear=function(n){var t=ga.year(n);return Math.floor((n-t-6e4*(n.getTimezoneOffset()-t.getTimezoneOffset()))/864e5)},["sunday","monday","tuesday","wednesday","thursday","friday","saturday"].forEach(function(n,t){t=7-t;var e=ga[n]=On(function(n){return(n=ga.day(n)).setDate(n.getDate()-(n.getDay()+t)%7),n},function(n,t){n.setDate(n.getDate()+7*Math.floor(t))},function(n){var e=ga.year(n).getDay();return Math.floor((ga.dayOfYear(n)+(e+t)%7)/7)-(e!==t)});ga[n+"s"]=e.range,ga[n+"s"].utc=e.utc.range,ga[n+"OfYear"]=function(n){var e=ga.year(n).getDay();return Math.floor((ga.dayOfYear(n)+(e+t)%7)/7)}}),ga.week=ga.sunday,ga.weeks=ga.sunday.range,ga.weeks.utc=ga.sunday.utc.range,ga.weekOfYear=ga.sundayOfYear;var ya={"-":"",_:" ",0:"0"},ma=/^\s*\d+/,Ma=/^%/;ao.locale=function(n){return{numberFormat:jn(n),timeFormat:Yn(n)}};var xa=ao.locale({decimal:".",thousands:",",grouping:[3],currency:["$",""],dateTime:"%a %b %e %X %Y",date:"%m/%d/%Y",time:"%H:%M:%S",periods:["AM","PM"],days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
shortDays:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]});ao.format=xa.numberFormat,ao.geo={},ft.prototype={s:0,t:0,add:function(n){st(n,this.t,ba),st(ba.s,this.s,this),this.s?this.t+=ba.t:this.s=ba.t},reset:function(){this.s=this.t=0},valueOf:function(){return this.s}};var ba=new ft;ao.geo.stream=function(n,t){n&&_a.hasOwnProperty(n.type)?_a[n.type](n,t):ht(n,t)};var _a={Feature:function(n,t){ht(n.geometry,t)},FeatureCollection:function(n,t){for(var e=n.features,r=-1,i=e.length;++r<i;)ht(e[r].geometry,t)}},wa={Sphere:function(n,t){t.sphere()},Point:function(n,t){n=n.coordinates,t.point(n[0],n[1],n[2])},MultiPoint:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)n=e[r],t.point(n[0],n[1],n[2])},LineString:function(n,t){pt(n.coordinates,t,0)},MultiLineString:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)pt(e[r],t,0)},Polygon:function(n,t){gt(n.coordinates,t)},MultiPolygon:function(n,t){for(var e=n.coordinates,r=-1,i=e.length;++r<i;)gt(e[r],t)},GeometryCollection:function(n,t){for(var e=n.geometries,r=-1,i=e.length;++r<i;)ht(e[r],t)}};ao.geo.area=function(n){return Sa=0,ao.geo.stream(n,Na),Sa};var Sa,ka=new ft,Na={sphere:function(){Sa+=4*Fo},point:b,lineStart:b,lineEnd:b,polygonStart:function(){ka.reset(),Na.lineStart=vt},polygonEnd:function(){var n=2*ka;Sa+=0>n?4*Fo+n:n,Na.lineStart=Na.lineEnd=Na.point=b}};ao.geo.bounds=function(){function n(n,t){M.push(x=[f=n,h=n]),s>t&&(s=t),t>p&&(p=t)}function t(t,e){var r=dt([t*Yo,e*Yo]);if(y){var i=mt(y,r),u=[i[1],-i[0],0],o=mt(u,i);bt(o),o=_t(o);var l=t-g,c=l>0?1:-1,v=o[0]*Zo*c,d=xo(l)>180;if(d^(v>c*g&&c*t>v)){var m=o[1]*Zo;m>p&&(p=m)}else if(v=(v+360)%360-180,d^(v>c*g&&c*t>v)){var m=-o[1]*Zo;s>m&&(s=m)}else s>e&&(s=e),e>p&&(p=e);d?g>t?a(f,t)>a(f,h)&&(h=t):a(t,h)>a(f,h)&&(f=t):h>=f?(f>t&&(f=t),t>h&&(h=t)):t>g?a(f,t)>a(f,h)&&(h=t):a(t,h)>a(f,h)&&(f=t)}else n(t,e);y=r,g=t}function e(){b.point=t}function r(){x[0]=f,x[1]=h,b.point=n,y=null}function i(n,e){if(y){var r=n-g;m+=xo(r)>180?r+(r>0?360:-360):r}else v=n,d=e;Na.point(n,e),t(n,e)}function u(){Na.lineStart()}function o(){i(v,d),Na.lineEnd(),xo(m)>Uo&&(f=-(h=180)),x[0]=f,x[1]=h,y=null}function a(n,t){return(t-=n)<0?t+360:t}function l(n,t){return n[0]-t[0]}function c(n,t){return t[0]<=t[1]?t[0]<=n&&n<=t[1]:n<t[0]||t[1]<n}var f,s,h,p,g,v,d,y,m,M,x,b={point:n,lineStart:e,lineEnd:r,polygonStart:function(){b.point=i,b.lineStart=u,b.lineEnd=o,m=0,Na.polygonStart()},polygonEnd:function(){Na.polygonEnd(),b.point=n,b.lineStart=e,b.lineEnd=r,0>ka?(f=-(h=180),s=-(p=90)):m>Uo?p=90:-Uo>m&&(s=-90),x[0]=f,x[1]=h}};return function(n){p=h=-(f=s=1/0),M=[],ao.geo.stream(n,b);var t=M.length;if(t){M.sort(l);for(var e,r=1,i=M[0],u=[i];t>r;++r)e=M[r],c(e[0],i)||c(e[1],i)?(a(i[0],e[1])>a(i[0],i[1])&&(i[1]=e[1]),a(e[0],i[1])>a(i[0],i[1])&&(i[0]=e[0])):u.push(i=e);for(var o,e,g=-(1/0),t=u.length-1,r=0,i=u[t];t>=r;i=e,++r)e=u[r],(o=a(i[1],e[0]))>g&&(g=o,f=e[0],h=i[1])}return M=x=null,f===1/0||s===1/0?[[NaN,NaN],[NaN,NaN]]:[[f,s],[h,p]]}}(),ao.geo.centroid=function(n){Ea=Aa=Ca=za=La=qa=Ta=Ra=Da=Pa=Ua=0,ao.geo.stream(n,ja);var t=Da,e=Pa,r=Ua,i=t*t+e*e+r*r;return jo>i&&(t=qa,e=Ta,r=Ra,Uo>Aa&&(t=Ca,e=za,r=La),i=t*t+e*e+r*r,jo>i)?[NaN,NaN]:[Math.atan2(e,t)*Zo,tn(r/Math.sqrt(i))*Zo]};var Ea,Aa,Ca,za,La,qa,Ta,Ra,Da,Pa,Ua,ja={sphere:b,point:St,lineStart:Nt,lineEnd:Et,polygonStart:function(){ja.lineStart=At},polygonEnd:function(){ja.lineStart=Nt}},Fa=Rt(zt,jt,Ht,[-Fo,-Fo/2]),Ha=1e9;ao.geo.clipExtent=function(){var n,t,e,r,i,u,o={stream:function(n){return i&&(i.valid=!1),i=u(n),i.valid=!0,i},extent:function(a){return arguments.length?(u=Zt(n=+a[0][0],t=+a[0][1],e=+a[1][0],r=+a[1][1]),i&&(i.valid=!1,i=null),o):[[n,t],[e,r]]}};return o.extent([[0,0],[960,500]])},(ao.geo.conicEqualArea=function(){return Vt(Xt)}).raw=Xt,ao.geo.albers=function(){return ao.geo.conicEqualArea().rotate([96,0]).center([-.6,38.7]).parallels([29.5,45.5]).scale(1070)},ao.geo.albersUsa=function(){function n(n){var u=n[0],o=n[1];return t=null,e(u,o),t||(r(u,o),t)||i(u,o),t}var t,e,r,i,u=ao.geo.albers(),o=ao.geo.conicEqualArea().rotate([154,0]).center([-2,58.5]).parallels([55,65]),a=ao.geo.conicEqualArea().rotate([157,0]).center([-3,19.9]).parallels([8,18]),l={point:function(n,e){t=[n,e]}};return n.invert=function(n){var t=u.scale(),e=u.translate(),r=(n[0]-e[0])/t,i=(n[1]-e[1])/t;return(i>=.12&&.234>i&&r>=-.425&&-.214>r?o:i>=.166&&.234>i&&r>=-.214&&-.115>r?a:u).invert(n)},n.stream=function(n){var t=u.stream(n),e=o.stream(n),r=a.stream(n);return{point:function(n,i){t.point(n,i),e.point(n,i),r.point(n,i)},sphere:function(){t.sphere(),e.sphere(),r.sphere()},lineStart:function(){t.lineStart(),e.lineStart(),r.lineStart()},lineEnd:function(){t.lineEnd(),e.lineEnd(),r.lineEnd()},polygonStart:function(){t.polygonStart(),e.polygonStart(),r.polygonStart()},polygonEnd:function(){t.polygonEnd(),e.polygonEnd(),r.polygonEnd()}}},n.precision=function(t){return arguments.length?(u.precision(t),o.precision(t),a.precision(t),n):u.precision()},n.scale=function(t){return arguments.length?(u.scale(t),o.scale(.35*t),a.scale(t),n.translate(u.translate())):u.scale()},n.translate=function(t){if(!arguments.length)return u.translate();var c=u.scale(),f=+t[0],s=+t[1];return e=u.translate(t).clipExtent([[f-.455*c,s-.238*c],[f+.455*c,s+.238*c]]).stream(l).point,r=o.translate([f-.307*c,s+.201*c]).clipExtent([[f-.425*c+Uo,s+.12*c+Uo],[f-.214*c-Uo,s+.234*c-Uo]]).stream(l).point,i=a.translate([f-.205*c,s+.212*c]).clipExtent([[f-.214*c+Uo,s+.166*c+Uo],[f-.115*c-Uo,s+.234*c-Uo]]).stream(l).point,n},n.scale(1070)};var Oa,Ia,Ya,Za,Va,Xa,$a={point:b,lineStart:b,lineEnd:b,polygonStart:function(){Ia=0,$a.lineStart=$t},polygonEnd:function(){$a.lineStart=$a.lineEnd=$a.point=b,Oa+=xo(Ia/2)}},Ba={point:Bt,lineStart:b,lineEnd:b,polygonStart:b,polygonEnd:b},Wa={point:Gt,lineStart:Kt,lineEnd:Qt,polygonStart:function(){Wa.lineStart=ne},polygonEnd:function(){Wa.point=Gt,Wa.lineStart=Kt,Wa.lineEnd=Qt}};ao.geo.path=function(){function n(n){return n&&("function"==typeof a&&u.pointRadius(+a.apply(this,arguments)),o&&o.valid||(o=i(u)),ao.geo.stream(n,o)),u.result()}function t(){return o=null,n}var e,r,i,u,o,a=4.5;return n.area=function(n){return Oa=0,ao.geo.stream(n,i($a)),Oa},n.centroid=function(n){return Ca=za=La=qa=Ta=Ra=Da=Pa=Ua=0,ao.geo.stream(n,i(Wa)),Ua?[Da/Ua,Pa/Ua]:Ra?[qa/Ra,Ta/Ra]:La?[Ca/La,za/La]:[NaN,NaN]},n.bounds=function(n){return Va=Xa=-(Ya=Za=1/0),ao.geo.stream(n,i(Ba)),[[Ya,Za],[Va,Xa]]},n.projection=function(n){return arguments.length?(i=(e=n)?n.stream||re(n):m,t()):e},n.context=function(n){return arguments.length?(u=null==(r=n)?new Wt:new te(n),"function"!=typeof a&&u.pointRadius(a),t()):r},n.pointRadius=function(t){return arguments.length?(a="function"==typeof t?t:(u.pointRadius(+t),+t),n):a},n.projection(ao.geo.albersUsa()).context(null)},ao.geo.transform=function(n){return{stream:function(t){var e=new ie(t);for(var r in n)e[r]=n[r];return e}}},ie.prototype={point:function(n,t){this.stream.point(n,t)},sphere:function(){this.stream.sphere()},lineStart:function(){this.stream.lineStart()},lineEnd:function(){this.stream.lineEnd()},polygonStart:function(){this.stream.polygonStart()},polygonEnd:function(){this.stream.polygonEnd()}},ao.geo.projection=oe,ao.geo.projectionMutator=ae,(ao.geo.equirectangular=function(){return oe(ce)}).raw=ce.invert=ce,ao.geo.rotation=function(n){function t(t){return t=n(t[0]*Yo,t[1]*Yo),t[0]*=Zo,t[1]*=Zo,t}return n=se(n[0]%360*Yo,n[1]*Yo,n.length>2?n[2]*Yo:0),t.invert=function(t){return t=n.invert(t[0]*Yo,t[1]*Yo),t[0]*=Zo,t[1]*=Zo,t},t},fe.invert=ce,ao.geo.circle=function(){function n(){var n="function"==typeof r?r.apply(this,arguments):r,t=se(-n[0]*Yo,-n[1]*Yo,0).invert,i=[];return e(null,null,1,{point:function(n,e){i.push(n=t(n,e)),n[0]*=Zo,n[1]*=Zo}}),{type:"Polygon",coordinates:[i]}}var t,e,r=[0,0],i=6;return n.origin=function(t){return arguments.length?(r=t,n):r},n.angle=function(r){return arguments.length?(e=ve((t=+r)*Yo,i*Yo),n):t},n.precision=function(r){return arguments.length?(e=ve(t*Yo,(i=+r)*Yo),n):i},n.angle(90)},ao.geo.distance=function(n,t){var e,r=(t[0]-n[0])*Yo,i=n[1]*Yo,u=t[1]*Yo,o=Math.sin(r),a=Math.cos(r),l=Math.sin(i),c=Math.cos(i),f=Math.sin(u),s=Math.cos(u);return Math.atan2(Math.sqrt((e=s*o)*e+(e=c*f-l*s*a)*e),l*f+c*s*a)},ao.geo.graticule=function(){function n(){return{type:"MultiLineString",coordinates:t()}}function t(){return ao.range(Math.ceil(u/d)*d,i,d).map(h).concat(ao.range(Math.ceil(c/y)*y,l,y).map(p)).concat(ao.range(Math.ceil(r/g)*g,e,g).filter(function(n){return xo(n%d)>Uo}).map(f)).concat(ao.range(Math.ceil(a/v)*v,o,v).filter(function(n){return xo(n%y)>Uo}).map(s))}var e,r,i,u,o,a,l,c,f,s,h,p,g=10,v=g,d=90,y=360,m=2.5;return n.lines=function(){return t().map(function(n){return{type:"LineString",coordinates:n}})},n.outline=function(){return{type:"Polygon",coordinates:[h(u).concat(p(l).slice(1),h(i).reverse().slice(1),p(c).reverse().slice(1))]}},n.extent=function(t){return arguments.length?n.majorExtent(t).minorExtent(t):n.minorExtent()},n.majorExtent=function(t){return arguments.length?(u=+t[0][0],i=+t[1][0],c=+t[0][1],l=+t[1][1],u>i&&(t=u,u=i,i=t),c>l&&(t=c,c=l,l=t),n.precision(m)):[[u,c],[i,l]]},n.minorExtent=function(t){return arguments.length?(r=+t[0][0],e=+t[1][0],a=+t[0][1],o=+t[1][1],r>e&&(t=r,r=e,e=t),a>o&&(t=a,a=o,o=t),n.precision(m)):[[r,a],[e,o]]},n.step=function(t){return arguments.length?n.majorStep(t).minorStep(t):n.minorStep()},n.majorStep=function(t){return arguments.length?(d=+t[0],y=+t[1],n):[d,y]},n.minorStep=function(t){return arguments.length?(g=+t[0],v=+t[1],n):[g,v]},n.precision=function(t){return arguments.length?(m=+t,f=ye(a,o,90),s=me(r,e,m),h=ye(c,l,90),p=me(u,i,m),n):m},n.majorExtent([[-180,-90+Uo],[180,90-Uo]]).minorExtent([[-180,-80-Uo],[180,80+Uo]])},ao.geo.greatArc=function(){function n(){return{type:"LineString",coordinates:[t||r.apply(this,arguments),e||i.apply(this,arguments)]}}var t,e,r=Me,i=xe;return n.distance=function(){return ao.geo.distance(t||r.apply(this,arguments),e||i.apply(this,arguments))},n.source=function(e){return arguments.length?(r=e,t="function"==typeof e?null:e,n):r},n.target=function(t){return arguments.length?(i=t,e="function"==typeof t?null:t,n):i},n.precision=function(){return arguments.length?n:0},n},ao.geo.interpolate=function(n,t){return be(n[0]*Yo,n[1]*Yo,t[0]*Yo,t[1]*Yo)},ao.geo.length=function(n){return Ja=0,ao.geo.stream(n,Ga),Ja};var Ja,Ga={sphere:b,point:b,lineStart:_e,lineEnd:b,polygonStart:b,polygonEnd:b},Ka=we(function(n){return Math.sqrt(2/(1+n))},function(n){return 2*Math.asin(n/2)});(ao.geo.azimuthalEqualArea=function(){return oe(Ka)}).raw=Ka;var Qa=we(function(n){var t=Math.acos(n);return t&&t/Math.sin(t)},m);(ao.geo.azimuthalEquidistant=function(){return oe(Qa)}).raw=Qa,(ao.geo.conicConformal=function(){return Vt(Se)}).raw=Se,(ao.geo.conicEquidistant=function(){return Vt(ke)}).raw=ke;var nl=we(function(n){return 1/n},Math.atan);(ao.geo.gnomonic=function(){return oe(nl)}).raw=nl,Ne.invert=function(n,t){return[n,2*Math.atan(Math.exp(t))-Io]},(ao.geo.mercator=function(){return Ee(Ne)}).raw=Ne;var tl=we(function(){return 1},Math.asin);(ao.geo.orthographic=function(){return oe(tl)}).raw=tl;var el=we(function(n){return 1/(1+n)},function(n){return 2*Math.atan(n)});(ao.geo.stereographic=function(){return oe(el)}).raw=el,Ae.invert=function(n,t){return[-t,2*Math.atan(Math.exp(n))-Io]},(ao.geo.transverseMercator=function(){var n=Ee(Ae),t=n.center,e=n.rotate;return n.center=function(n){return n?t([-n[1],n[0]]):(n=t(),[n[1],-n[0]])},n.rotate=function(n){return n?e([n[0],n[1],n.length>2?n[2]+90:90]):(n=e(),[n[0],n[1],n[2]-90])},e([0,0,90])}).raw=Ae,ao.geom={},ao.geom.hull=function(n){function t(n){if(n.length<3)return[];var t,i=En(e),u=En(r),o=n.length,a=[],l=[];for(t=0;o>t;t++)a.push([+i.call(this,n[t],t),+u.call(this,n[t],t),t]);for(a.sort(qe),t=0;o>t;t++)l.push([a[t][0],-a[t][1]]);var c=Le(a),f=Le(l),s=f[0]===c[0],h=f[f.length-1]===c[c.length-1],p=[];for(t=c.length-1;t>=0;--t)p.push(n[a[c[t]][2]]);for(t=+s;t<f.length-h;++t)p.push(n[a[f[t]][2]]);return p}var e=Ce,r=ze;return arguments.length?t(n):(t.x=function(n){return arguments.length?(e=n,t):e},t.y=function(n){return arguments.length?(r=n,t):r},t)},ao.geom.polygon=function(n){return ko(n,rl),n};var rl=ao.geom.polygon.prototype=[];rl.area=function(){for(var n,t=-1,e=this.length,r=this[e-1],i=0;++t<e;)n=r,r=this[t],i+=n[1]*r[0]-n[0]*r[1];return.5*i},rl.centroid=function(n){var t,e,r=-1,i=this.length,u=0,o=0,a=this[i-1];for(arguments.length||(n=-1/(6*this.area()));++r<i;)t=a,a=this[r],e=t[0]*a[1]-a[0]*t[1],u+=(t[0]+a[0])*e,o+=(t[1]+a[1])*e;return[u*n,o*n]},rl.clip=function(n){for(var t,e,r,i,u,o,a=De(n),l=-1,c=this.length-De(this),f=this[c-1];++l<c;){for(t=n.slice(),n.length=0,i=this[l],u=t[(r=t.length-a)-1],e=-1;++e<r;)o=t[e],Te(o,f,i)?(Te(u,f,i)||n.push(Re(u,o,f,i)),n.push(o)):Te(u,f,i)&&n.push(Re(u,o,f,i)),u=o;a&&n.push(n[0]),f=i}return n};var il,ul,ol,al,ll,cl=[],fl=[];Ye.prototype.prepare=function(){for(var n,t=this.edges,e=t.length;e--;)n=t[e].edge,n.b&&n.a||t.splice(e,1);return t.sort(Ve),t.length},tr.prototype={start:function(){return this.edge.l===this.site?this.edge.a:this.edge.b},end:function(){return this.edge.l===this.site?this.edge.b:this.edge.a}},er.prototype={insert:function(n,t){var e,r,i;if(n){if(t.P=n,t.N=n.N,n.N&&(n.N.P=t),n.N=t,n.R){for(n=n.R;n.L;)n=n.L;n.L=t}else n.R=t;e=n}else this._?(n=or(this._),t.P=null,t.N=n,n.P=n.L=t,e=n):(t.P=t.N=null,this._=t,e=null);for(t.L=t.R=null,t.U=e,t.C=!0,n=t;e&&e.C;)r=e.U,e===r.L?(i=r.R,i&&i.C?(e.C=i.C=!1,r.C=!0,n=r):(n===e.R&&(ir(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ur(this,r))):(i=r.L,i&&i.C?(e.C=i.C=!1,r.C=!0,n=r):(n===e.L&&(ur(this,e),n=e,e=n.U),e.C=!1,r.C=!0,ir(this,r))),e=n.U;this._.C=!1},remove:function(n){n.N&&(n.N.P=n.P),n.P&&(n.P.N=n.N),n.N=n.P=null;var t,e,r,i=n.U,u=n.L,o=n.R;if(e=u?o?or(o):u:o,i?i.L===n?i.L=e:i.R=e:this._=e,u&&o?(r=e.C,e.C=n.C,e.L=u,u.U=e,e!==o?(i=e.U,e.U=n.U,n=e.R,i.L=n,e.R=o,o.U=e):(e.U=i,i=e,n=e.R)):(r=n.C,n=e),n&&(n.U=i),!r){if(n&&n.C)return void(n.C=!1);do{if(n===this._)break;if(n===i.L){if(t=i.R,t.C&&(t.C=!1,i.C=!0,ir(this,i),t=i.R),t.L&&t.L.C||t.R&&t.R.C){t.R&&t.R.C||(t.L.C=!1,t.C=!0,ur(this,t),t=i.R),t.C=i.C,i.C=t.R.C=!1,ir(this,i),n=this._;break}}else if(t=i.L,t.C&&(t.C=!1,i.C=!0,ur(this,i),t=i.L),t.L&&t.L.C||t.R&&t.R.C){t.L&&t.L.C||(t.R.C=!1,t.C=!0,ir(this,t),t=i.L),t.C=i.C,i.C=t.L.C=!1,ur(this,i),n=this._;break}t.C=!0,n=i,i=i.U}while(!n.C);n&&(n.C=!1)}}},ao.geom.voronoi=function(n){function t(n){var t=new Array(n.length),r=a[0][0],i=a[0][1],u=a[1][0],o=a[1][1];return ar(e(n),a).cells.forEach(function(e,a){var l=e.edges,c=e.site,f=t[a]=l.length?l.map(function(n){var t=n.start();return[t.x,t.y]}):c.x>=r&&c.x<=u&&c.y>=i&&c.y<=o?[[r,o],[u,o],[u,i],[r,i]]:[];f.point=n[a]}),t}function e(n){return n.map(function(n,t){return{x:Math.round(u(n,t)/Uo)*Uo,y:Math.round(o(n,t)/Uo)*Uo,i:t}})}var r=Ce,i=ze,u=r,o=i,a=sl;return n?t(n):(t.links=function(n){return ar(e(n)).edges.filter(function(n){return n.l&&n.r}).map(function(t){return{source:n[t.l.i],target:n[t.r.i]}})},t.triangles=function(n){var t=[];return ar(e(n)).cells.forEach(function(e,r){for(var i,u,o=e.site,a=e.edges.sort(Ve),l=-1,c=a.length,f=a[c-1].edge,s=f.l===o?f.r:f.l;++l<c;)i=f,u=s,f=a[l].edge,s=f.l===o?f.r:f.l,r<u.i&&r<s.i&&cr(o,u,s)<0&&t.push([n[r],n[u.i],n[s.i]])}),t},t.x=function(n){return arguments.length?(u=En(r=n),t):r},t.y=function(n){return arguments.length?(o=En(i=n),t):i},t.clipExtent=function(n){return arguments.length?(a=null==n?sl:n,t):a===sl?null:a},t.size=function(n){return arguments.length?t.clipExtent(n&&[[0,0],n]):a===sl?null:a&&a[1]},t)};var sl=[[-1e6,-1e6],[1e6,1e6]];ao.geom.delaunay=function(n){return ao.geom.voronoi().triangles(n)},ao.geom.quadtree=function(n,t,e,r,i){function u(n){function u(n,t,e,r,i,u,o,a){if(!isNaN(e)&&!isNaN(r))if(n.leaf){var l=n.x,f=n.y;if(null!=l)if(xo(l-e)+xo(f-r)<.01)c(n,t,e,r,i,u,o,a);else{var s=n.point;n.x=n.y=n.point=null,c(n,s,l,f,i,u,o,a),c(n,t,e,r,i,u,o,a)}else n.x=e,n.y=r,n.point=t}else c(n,t,e,r,i,u,o,a)}function c(n,t,e,r,i,o,a,l){var c=.5*(i+a),f=.5*(o+l),s=e>=c,h=r>=f,p=h<<1|s;n.leaf=!1,n=n.nodes[p]||(n.nodes[p]=hr()),s?i=c:a=c,h?o=f:l=f,u(n,t,e,r,i,o,a,l)}var f,s,h,p,g,v,d,y,m,M=En(a),x=En(l);if(null!=t)v=t,d=e,y=r,m=i;else if(y=m=-(v=d=1/0),s=[],h=[],g=n.length,o)for(p=0;g>p;++p)f=n[p],f.x<v&&(v=f.x),f.y<d&&(d=f.y),f.x>y&&(y=f.x),f.y>m&&(m=f.y),s.push(f.x),h.push(f.y);else for(p=0;g>p;++p){var b=+M(f=n[p],p),_=+x(f,p);v>b&&(v=b),d>_&&(d=_),b>y&&(y=b),_>m&&(m=_),s.push(b),h.push(_)}var w=y-v,S=m-d;w>S?m=d+w:y=v+S;var k=hr();if(k.add=function(n){u(k,n,+M(n,++p),+x(n,p),v,d,y,m)},k.visit=function(n){pr(n,k,v,d,y,m)},k.find=function(n){return gr(k,n[0],n[1],v,d,y,m)},p=-1,null==t){for(;++p<g;)u(k,n[p],s[p],h[p],v,d,y,m);--p}else n.forEach(k.add);return s=h=n=f=null,k}var o,a=Ce,l=ze;return(o=arguments.length)?(a=fr,l=sr,3===o&&(i=e,r=t,e=t=0),u(n)):(u.x=function(n){return arguments.length?(a=n,u):a},u.y=function(n){return arguments.length?(l=n,u):l},u.extent=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=+n[0][0],e=+n[0][1],r=+n[1][0],i=+n[1][1]),u):null==t?null:[[t,e],[r,i]]},u.size=function(n){return arguments.length?(null==n?t=e=r=i=null:(t=e=0,r=+n[0],i=+n[1]),u):null==t?null:[r-t,i-e]},u)},ao.interpolateRgb=vr,ao.interpolateObject=dr,ao.interpolateNumber=yr,ao.interpolateString=mr;var hl=/[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g,pl=new RegExp(hl.source,"g");ao.interpolate=Mr,ao.interpolators=[function(n,t){var e=typeof t;return("string"===e?ua.has(t.toLowerCase())||/^(#|rgb\(|hsl\()/i.test(t)?vr:mr:t instanceof an?vr:Array.isArray(t)?xr:"object"===e&&isNaN(t)?dr:yr)(n,t)}],ao.interpolateArray=xr;var gl=function(){return m},vl=ao.map({linear:gl,poly:Er,quad:function(){return Sr},cubic:function(){return kr},sin:function(){return Ar},exp:function(){return Cr},circle:function(){return zr},elastic:Lr,back:qr,bounce:function(){return Tr}}),dl=ao.map({"in":m,out:_r,"in-out":wr,"out-in":function(n){return wr(_r(n))}});ao.ease=function(n){var t=n.indexOf("-"),e=t>=0?n.slice(0,t):n,r=t>=0?n.slice(t+1):"in";return e=vl.get(e)||gl,r=dl.get(r)||m,br(r(e.apply(null,lo.call(arguments,1))))},ao.interpolateHcl=Rr,ao.interpolateHsl=Dr,ao.interpolateLab=Pr,ao.interpolateRound=Ur,ao.transform=function(n){var t=fo.createElementNS(ao.ns.prefix.svg,"g");return(ao.transform=function(n){if(null!=n){t.setAttribute("transform",n);var e=t.transform.baseVal.consolidate()}return new jr(e?e.matrix:yl)})(n)},jr.prototype.toString=function(){return"translate("+this.translate+")rotate("+this.rotate+")skewX("+this.skew+")scale("+this.scale+")"};var yl={a:1,b:0,c:0,d:1,e:0,f:0};ao.interpolateTransform=$r,ao.layout={},ao.layout.bundle=function(){return function(n){for(var t=[],e=-1,r=n.length;++e<r;)t.push(Jr(n[e]));return t}},ao.layout.chord=function(){function n(){var n,c,s,h,p,g={},v=[],d=ao.range(u),y=[];for(e=[],r=[],n=0,h=-1;++h<u;){for(c=0,p=-1;++p<u;)c+=i[h][p];v.push(c),y.push(ao.range(u)),n+=c}for(o&&d.sort(function(n,t){return o(v[n],v[t])}),a&&y.forEach(function(n,t){n.sort(function(n,e){return a(i[t][n],i[t][e])})}),n=(Ho-f*u)/n,c=0,h=-1;++h<u;){for(s=c,p=-1;++p<u;){var m=d[h],M=y[m][p],x=i[m][M],b=c,_=c+=x*n;g[m+"-"+M]={index:m,subindex:M,startAngle:b,endAngle:_,value:x}}r[m]={index:m,startAngle:s,endAngle:c,value:v[m]},c+=f}for(h=-1;++h<u;)for(p=h-1;++p<u;){var w=g[h+"-"+p],S=g[p+"-"+h];(w.value||S.value)&&e.push(w.value<S.value?{source:S,target:w}:{source:w,target:S})}l&&t()}function t(){e.sort(function(n,t){return l((n.source.value+n.target.value)/2,(t.source.value+t.target.value)/2)})}var e,r,i,u,o,a,l,c={},f=0;return c.matrix=function(n){return arguments.length?(u=(i=n)&&i.length,e=r=null,c):i},c.padding=function(n){return arguments.length?(f=n,e=r=null,c):f},c.sortGroups=function(n){return arguments.length?(o=n,e=r=null,c):o},c.sortSubgroups=function(n){return arguments.length?(a=n,e=null,c):a},c.sortChords=function(n){return arguments.length?(l=n,e&&t(),c):l},c.chords=function(){return e||n(),e},c.groups=function(){return r||n(),r},c},ao.layout.force=function(){function n(n){return function(t,e,r,i){if(t.point!==n){var u=t.cx-n.x,o=t.cy-n.y,a=i-e,l=u*u+o*o;if(l>a*a/y){if(v>l){var c=t.charge/l;n.px-=u*c,n.py-=o*c}return!0}if(t.point&&l&&v>l){var c=t.pointCharge/l;n.px-=u*c,n.py-=o*c}}return!t.charge}}function t(n){n.px=ao.event.x,n.py=ao.event.y,l.resume()}var e,r,i,u,o,a,l={},c=ao.dispatch("start","tick","end"),f=[1,1],s=.9,h=ml,p=Ml,g=-30,v=xl,d=.1,y=.64,M=[],x=[];return l.tick=function(){if((i*=.99)<.005)return e=null,c.end({type:"end",alpha:i=0}),!0;var t,r,l,h,p,v,y,m,b,_=M.length,w=x.length;for(r=0;w>r;++r)l=x[r],h=l.source,p=l.target,m=p.x-h.x,b=p.y-h.y,(v=m*m+b*b)&&(v=i*o[r]*((v=Math.sqrt(v))-u[r])/v,m*=v,b*=v,p.x-=m*(y=h.weight+p.weight?h.weight/(h.weight+p.weight):.5),p.y-=b*y,h.x+=m*(y=1-y),h.y+=b*y);if((y=i*d)&&(m=f[0]/2,b=f[1]/2,r=-1,y))for(;++r<_;)l=M[r],l.x+=(m-l.x)*y,l.y+=(b-l.y)*y;if(g)for(ri(t=ao.geom.quadtree(M),i,a),r=-1;++r<_;)(l=M[r]).fixed||t.visit(n(l));for(r=-1;++r<_;)l=M[r],l.fixed?(l.x=l.px,l.y=l.py):(l.x-=(l.px-(l.px=l.x))*s,l.y-=(l.py-(l.py=l.y))*s);c.tick({type:"tick",alpha:i})},l.nodes=function(n){return arguments.length?(M=n,l):M},l.links=function(n){return arguments.length?(x=n,l):x},l.size=function(n){return arguments.length?(f=n,l):f},l.linkDistance=function(n){return arguments.length?(h="function"==typeof n?n:+n,l):h},l.distance=l.linkDistance,l.linkStrength=function(n){return arguments.length?(p="function"==typeof n?n:+n,l):p},l.friction=function(n){return arguments.length?(s=+n,l):s},l.charge=function(n){return arguments.length?(g="function"==typeof n?n:+n,l):g},l.chargeDistance=function(n){return arguments.length?(v=n*n,l):Math.sqrt(v)},l.gravity=function(n){return arguments.length?(d=+n,l):d},l.theta=function(n){return arguments.length?(y=n*n,l):Math.sqrt(y)},l.alpha=function(n){return arguments.length?(n=+n,i?n>0?i=n:(e.c=null,e.t=NaN,e=null,c.end({type:"end",alpha:i=0})):n>0&&(c.start({type:"start",alpha:i=n}),e=qn(l.tick)),l):i},l.start=function(){function n(n,r){if(!e){for(e=new Array(i),l=0;i>l;++l)e[l]=[];for(l=0;c>l;++l){var u=x[l];e[u.source.index].push(u.target),e[u.target.index].push(u.source)}}for(var o,a=e[t],l=-1,f=a.length;++l<f;)if(!isNaN(o=a[l][n]))return o;return Math.random()*r}var t,e,r,i=M.length,c=x.length,s=f[0],v=f[1];for(t=0;i>t;++t)(r=M[t]).index=t,r.weight=0;for(t=0;c>t;++t)r=x[t],"number"==typeof r.source&&(r.source=M[r.source]),"number"==typeof r.target&&(r.target=M[r.target]),++r.source.weight,++r.target.weight;for(t=0;i>t;++t)r=M[t],isNaN(r.x)&&(r.x=n("x",s)),isNaN(r.y)&&(r.y=n("y",v)),isNaN(r.px)&&(r.px=r.x),isNaN(r.py)&&(r.py=r.y);if(u=[],"function"==typeof h)for(t=0;c>t;++t)u[t]=+h.call(this,x[t],t);else for(t=0;c>t;++t)u[t]=h;if(o=[],"function"==typeof p)for(t=0;c>t;++t)o[t]=+p.call(this,x[t],t);else for(t=0;c>t;++t)o[t]=p;if(a=[],"function"==typeof g)for(t=0;i>t;++t)a[t]=+g.call(this,M[t],t);else for(t=0;i>t;++t)a[t]=g;return l.resume()},l.resume=function(){return l.alpha(.1)},l.stop=function(){return l.alpha(0)},l.drag=function(){return r||(r=ao.behavior.drag().origin(m).on("dragstart.force",Qr).on("drag.force",t).on("dragend.force",ni)),arguments.length?void this.on("mouseover.force",ti).on("mouseout.force",ei).call(r):r},ao.rebind(l,c,"on")};var ml=20,Ml=1,xl=1/0;ao.layout.hierarchy=function(){function n(i){var u,o=[i],a=[];for(i.depth=0;null!=(u=o.pop());)if(a.push(u),(c=e.call(n,u,u.depth))&&(l=c.length)){for(var l,c,f;--l>=0;)o.push(f=c[l]),f.parent=u,f.depth=u.depth+1;r&&(u.value=0),u.children=c}else r&&(u.value=+r.call(n,u,u.depth)||0),delete u.children;return oi(i,function(n){var e,i;t&&(e=n.children)&&e.sort(t),r&&(i=n.parent)&&(i.value+=n.value)}),a}var t=ci,e=ai,r=li;return n.sort=function(e){return arguments.length?(t=e,n):t},n.children=function(t){return arguments.length?(e=t,n):e},n.value=function(t){return arguments.length?(r=t,n):r},n.revalue=function(t){return r&&(ui(t,function(n){n.children&&(n.value=0)}),oi(t,function(t){var e;t.children||(t.value=+r.call(n,t,t.depth)||0),(e=t.parent)&&(e.value+=t.value)})),t},n},ao.layout.partition=function(){function n(t,e,r,i){var u=t.children;if(t.x=e,t.y=t.depth*i,t.dx=r,t.dy=i,u&&(o=u.length)){var o,a,l,c=-1;for(r=t.value?r/t.value:0;++c<o;)n(a=u[c],e,l=a.value*r,i),e+=l}}function t(n){var e=n.children,r=0;if(e&&(i=e.length))for(var i,u=-1;++u<i;)r=Math.max(r,t(e[u]));return 1+r}function e(e,u){var o=r.call(this,e,u);return n(o[0],0,i[0],i[1]/t(o[0])),o}var r=ao.layout.hierarchy(),i=[1,1];return e.size=function(n){return arguments.length?(i=n,e):i},ii(e,r)},ao.layout.pie=function(){function n(o){var a,l=o.length,c=o.map(function(e,r){return+t.call(n,e,r)}),f=+("function"==typeof r?r.apply(this,arguments):r),s=("function"==typeof i?i.apply(this,arguments):i)-f,h=Math.min(Math.abs(s)/l,+("function"==typeof u?u.apply(this,arguments):u)),p=h*(0>s?-1:1),g=ao.sum(c),v=g?(s-l*p)/g:0,d=ao.range(l),y=[];return null!=e&&d.sort(e===bl?function(n,t){return c[t]-c[n]}:function(n,t){return e(o[n],o[t])}),d.forEach(function(n){y[n]={data:o[n],value:a=c[n],startAngle:f,endAngle:f+=a*v+p,padAngle:h}}),y}var t=Number,e=bl,r=0,i=Ho,u=0;return n.value=function(e){return arguments.length?(t=e,n):t},n.sort=function(t){return arguments.length?(e=t,n):e},n.startAngle=function(t){return arguments.length?(r=t,n):r},n.endAngle=function(t){return arguments.length?(i=t,n):i},n.padAngle=function(t){return arguments.length?(u=t,n):u},n};var bl={};ao.layout.stack=function(){function n(a,l){if(!(h=a.length))return a;var c=a.map(function(e,r){return t.call(n,e,r)}),f=c.map(function(t){return t.map(function(t,e){return[u.call(n,t,e),o.call(n,t,e)]})}),s=e.call(n,f,l);c=ao.permute(c,s),f=ao.permute(f,s);var h,p,g,v,d=r.call(n,f,l),y=c[0].length;for(g=0;y>g;++g)for(i.call(n,c[0][g],v=d[g],f[0][g][1]),p=1;h>p;++p)i.call(n,c[p][g],v+=f[p-1][g][1],f[p][g][1]);return a}var t=m,e=gi,r=vi,i=pi,u=si,o=hi;return n.values=function(e){return arguments.length?(t=e,n):t},n.order=function(t){return arguments.length?(e="function"==typeof t?t:_l.get(t)||gi,n):e},n.offset=function(t){return arguments.length?(r="function"==typeof t?t:wl.get(t)||vi,n):r},n.x=function(t){return arguments.length?(u=t,n):u},n.y=function(t){return arguments.length?(o=t,n):o},n.out=function(t){return arguments.length?(i=t,n):i},n};var _l=ao.map({"inside-out":function(n){var t,e,r=n.length,i=n.map(di),u=n.map(yi),o=ao.range(r).sort(function(n,t){return i[n]-i[t]}),a=0,l=0,c=[],f=[];for(t=0;r>t;++t)e=o[t],l>a?(a+=u[e],c.push(e)):(l+=u[e],f.push(e));return f.reverse().concat(c)},reverse:function(n){return ao.range(n.length).reverse()},"default":gi}),wl=ao.map({silhouette:function(n){var t,e,r,i=n.length,u=n[0].length,o=[],a=0,l=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];r>a&&(a=r),o.push(r)}for(e=0;u>e;++e)l[e]=(a-o[e])/2;return l},wiggle:function(n){var t,e,r,i,u,o,a,l,c,f=n.length,s=n[0],h=s.length,p=[];for(p[0]=l=c=0,e=1;h>e;++e){for(t=0,i=0;f>t;++t)i+=n[t][e][1];for(t=0,u=0,a=s[e][0]-s[e-1][0];f>t;++t){for(r=0,o=(n[t][e][1]-n[t][e-1][1])/(2*a);t>r;++r)o+=(n[r][e][1]-n[r][e-1][1])/a;u+=o*n[t][e][1]}p[e]=l-=i?u/i*a:0,c>l&&(c=l)}for(e=0;h>e;++e)p[e]-=c;return p},expand:function(n){var t,e,r,i=n.length,u=n[0].length,o=1/i,a=[];for(e=0;u>e;++e){for(t=0,r=0;i>t;t++)r+=n[t][e][1];if(r)for(t=0;i>t;t++)n[t][e][1]/=r;else for(t=0;i>t;t++)n[t][e][1]=o}for(e=0;u>e;++e)a[e]=0;return a},zero:vi});ao.layout.histogram=function(){function n(n,u){for(var o,a,l=[],c=n.map(e,this),f=r.call(this,c,u),s=i.call(this,f,c,u),u=-1,h=c.length,p=s.length-1,g=t?1:1/h;++u<p;)o=l[u]=[],o.dx=s[u+1]-(o.x=s[u]),o.y=0;if(p>0)for(u=-1;++u<h;)a=c[u],a>=f[0]&&a<=f[1]&&(o=l[ao.bisect(s,a,1,p)-1],o.y+=g,o.push(n[u]));return l}var t=!0,e=Number,r=bi,i=Mi;return n.value=function(t){return arguments.length?(e=t,n):e},n.range=function(t){return arguments.length?(r=En(t),n):r},n.bins=function(t){return arguments.length?(i="number"==typeof t?function(n){return xi(n,t)}:En(t),n):i},n.frequency=function(e){return arguments.length?(t=!!e,n):t},n},ao.layout.pack=function(){function n(n,u){var o=e.call(this,n,u),a=o[0],l=i[0],c=i[1],f=null==t?Math.sqrt:"function"==typeof t?t:function(){return t};if(a.x=a.y=0,oi(a,function(n){n.r=+f(n.value)}),oi(a,Ni),r){var s=r*(t?1:Math.max(2*a.r/l,2*a.r/c))/2;oi(a,function(n){n.r+=s}),oi(a,Ni),oi(a,function(n){n.r-=s})}return Ci(a,l/2,c/2,t?1:1/Math.max(2*a.r/l,2*a.r/c)),o}var t,e=ao.layout.hierarchy().sort(_i),r=0,i=[1,1];return n.size=function(t){return arguments.length?(i=t,n):i},n.radius=function(e){return arguments.length?(t=null==e||"function"==typeof e?e:+e,n):t},n.padding=function(t){return arguments.length?(r=+t,n):r},ii(n,e)},ao.layout.tree=function(){function n(n,i){var f=o.call(this,n,i),s=f[0],h=t(s);if(oi(h,e),h.parent.m=-h.z,ui(h,r),c)ui(s,u);else{var p=s,g=s,v=s;ui(s,function(n){n.x<p.x&&(p=n),n.x>g.x&&(g=n),n.depth>v.depth&&(v=n)});var d=a(p,g)/2-p.x,y=l[0]/(g.x+a(g,p)/2+d),m=l[1]/(v.depth||1);ui(s,function(n){n.x=(n.x+d)*y,n.y=n.depth*m})}return f}function t(n){for(var t,e={A:null,children:[n]},r=[e];null!=(t=r.pop());)for(var i,u=t.children,o=0,a=u.length;a>o;++o)r.push((u[o]=i={_:u[o],parent:t,children:(i=u[o].children)&&i.slice()||[],A:null,a:null,z:0,m:0,c:0,s:0,t:null,i:o}).a=i);return e.children[0]}function e(n){var t=n.children,e=n.parent.children,r=n.i?e[n.i-1]:null;if(t.length){Di(n);var u=(t[0].z+t[t.length-1].z)/2;r?(n.z=r.z+a(n._,r._),n.m=n.z-u):n.z=u}else r&&(n.z=r.z+a(n._,r._));n.parent.A=i(n,r,n.parent.A||e[0])}function r(n){n._.x=n.z+n.parent.m,n.m+=n.parent.m}function i(n,t,e){if(t){for(var r,i=n,u=n,o=t,l=i.parent.children[0],c=i.m,f=u.m,s=o.m,h=l.m;o=Ti(o),i=qi(i),o&&i;)l=qi(l),u=Ti(u),u.a=n,r=o.z+s-i.z-c+a(o._,i._),r>0&&(Ri(Pi(o,n,e),n,r),c+=r,f+=r),s+=o.m,c+=i.m,h+=l.m,f+=u.m;o&&!Ti(u)&&(u.t=o,u.m+=s-f),i&&!qi(l)&&(l.t=i,l.m+=c-h,e=n)}return e}function u(n){n.x*=l[0],n.y=n.depth*l[1]}var o=ao.layout.hierarchy().sort(null).value(null),a=Li,l=[1,1],c=null;return n.separation=function(t){return arguments.length?(a=t,n):a},n.size=function(t){return arguments.length?(c=null==(l=t)?u:null,n):c?null:l},n.nodeSize=function(t){return arguments.length?(c=null==(l=t)?null:u,n):c?l:null},ii(n,o)},ao.layout.cluster=function(){function n(n,u){var o,a=t.call(this,n,u),l=a[0],c=0;oi(l,function(n){var t=n.children;t&&t.length?(n.x=ji(t),n.y=Ui(t)):(n.x=o?c+=e(n,o):0,n.y=0,o=n)});var f=Fi(l),s=Hi(l),h=f.x-e(f,s)/2,p=s.x+e(s,f)/2;return oi(l,i?function(n){n.x=(n.x-l.x)*r[0],n.y=(l.y-n.y)*r[1]}:function(n){n.x=(n.x-h)/(p-h)*r[0],n.y=(1-(l.y?n.y/l.y:1))*r[1]}),a}var t=ao.layout.hierarchy().sort(null).value(null),e=Li,r=[1,1],i=!1;return n.separation=function(t){return arguments.length?(e=t,n):e},n.size=function(t){return arguments.length?(i=null==(r=t),n):i?null:r},n.nodeSize=function(t){return arguments.length?(i=null!=(r=t),n):i?r:null},ii(n,t)},ao.layout.treemap=function(){function n(n,t){for(var e,r,i=-1,u=n.length;++i<u;)r=(e=n[i]).value*(0>t?0:t),e.area=isNaN(r)||0>=r?0:r}function t(e){var u=e.children;if(u&&u.length){var o,a,l,c=s(e),f=[],h=u.slice(),g=1/0,v="slice"===p?c.dx:"dice"===p?c.dy:"slice-dice"===p?1&e.depth?c.dy:c.dx:Math.min(c.dx,c.dy);for(n(h,c.dx*c.dy/e.value),f.area=0;(l=h.length)>0;)f.push(o=h[l-1]),f.area+=o.area,"squarify"!==p||(a=r(f,v))<=g?(h.pop(),g=a):(f.area-=f.pop().area,i(f,v,c,!1),v=Math.min(c.dx,c.dy),f.length=f.area=0,g=1/0);f.length&&(i(f,v,c,!0),f.length=f.area=0),u.forEach(t)}}function e(t){var r=t.children;if(r&&r.length){var u,o=s(t),a=r.slice(),l=[];for(n(a,o.dx*o.dy/t.value),l.area=0;u=a.pop();)l.push(u),l.area+=u.area,null!=u.z&&(i(l,u.z?o.dx:o.dy,o,!a.length),l.length=l.area=0);r.forEach(e)}}function r(n,t){for(var e,r=n.area,i=0,u=1/0,o=-1,a=n.length;++o<a;)(e=n[o].area)&&(u>e&&(u=e),e>i&&(i=e));return r*=r,t*=t,r?Math.max(t*i*g/r,r/(t*u*g)):1/0}function i(n,t,e,r){var i,u=-1,o=n.length,a=e.x,c=e.y,f=t?l(n.area/t):0;
if(t==e.dx){for((r||f>e.dy)&&(f=e.dy);++u<o;)i=n[u],i.x=a,i.y=c,i.dy=f,a+=i.dx=Math.min(e.x+e.dx-a,f?l(i.area/f):0);i.z=!0,i.dx+=e.x+e.dx-a,e.y+=f,e.dy-=f}else{for((r||f>e.dx)&&(f=e.dx);++u<o;)i=n[u],i.x=a,i.y=c,i.dx=f,c+=i.dy=Math.min(e.y+e.dy-c,f?l(i.area/f):0);i.z=!1,i.dy+=e.y+e.dy-c,e.x+=f,e.dx-=f}}function u(r){var i=o||a(r),u=i[0];return u.x=u.y=0,u.value?(u.dx=c[0],u.dy=c[1]):u.dx=u.dy=0,o&&a.revalue(u),n([u],u.dx*u.dy/u.value),(o?e:t)(u),h&&(o=i),i}var o,a=ao.layout.hierarchy(),l=Math.round,c=[1,1],f=null,s=Oi,h=!1,p="squarify",g=.5*(1+Math.sqrt(5));return u.size=function(n){return arguments.length?(c=n,u):c},u.padding=function(n){function t(t){var e=n.call(u,t,t.depth);return null==e?Oi(t):Ii(t,"number"==typeof e?[e,e,e,e]:e)}function e(t){return Ii(t,n)}if(!arguments.length)return f;var r;return s=null==(f=n)?Oi:"function"==(r=typeof n)?t:"number"===r?(n=[n,n,n,n],e):e,u},u.round=function(n){return arguments.length?(l=n?Math.round:Number,u):l!=Number},u.sticky=function(n){return arguments.length?(h=n,o=null,u):h},u.ratio=function(n){return arguments.length?(g=n,u):g},u.mode=function(n){return arguments.length?(p=n+"",u):p},ii(u,a)},ao.random={normal:function(n,t){var e=arguments.length;return 2>e&&(t=1),1>e&&(n=0),function(){var e,r,i;do e=2*Math.random()-1,r=2*Math.random()-1,i=e*e+r*r;while(!i||i>1);return n+t*e*Math.sqrt(-2*Math.log(i)/i)}},logNormal:function(){var n=ao.random.normal.apply(ao,arguments);return function(){return Math.exp(n())}},bates:function(n){var t=ao.random.irwinHall(n);return function(){return t()/n}},irwinHall:function(n){return function(){for(var t=0,e=0;n>e;e++)t+=Math.random();return t}}},ao.scale={};var Sl={floor:m,ceil:m};ao.scale.linear=function(){return Wi([0,1],[0,1],Mr,!1)};var kl={s:1,g:1,p:1,r:1,e:1};ao.scale.log=function(){return ru(ao.scale.linear().domain([0,1]),10,!0,[1,10])};var Nl=ao.format(".0e"),El={floor:function(n){return-Math.ceil(-n)},ceil:function(n){return-Math.floor(-n)}};ao.scale.pow=function(){return iu(ao.scale.linear(),1,[0,1])},ao.scale.sqrt=function(){return ao.scale.pow().exponent(.5)},ao.scale.ordinal=function(){return ou([],{t:"range",a:[[]]})},ao.scale.category10=function(){return ao.scale.ordinal().range(Al)},ao.scale.category20=function(){return ao.scale.ordinal().range(Cl)},ao.scale.category20b=function(){return ao.scale.ordinal().range(zl)},ao.scale.category20c=function(){return ao.scale.ordinal().range(Ll)};var Al=[2062260,16744206,2924588,14034728,9725885,9197131,14907330,8355711,12369186,1556175].map(xn),Cl=[2062260,11454440,16744206,16759672,2924588,10018698,14034728,16750742,9725885,12955861,9197131,12885140,14907330,16234194,8355711,13092807,12369186,14408589,1556175,10410725].map(xn),zl=[3750777,5395619,7040719,10264286,6519097,9216594,11915115,13556636,9202993,12426809,15186514,15190932,8666169,11356490,14049643,15177372,8077683,10834324,13528509,14589654].map(xn),Ll=[3244733,7057110,10406625,13032431,15095053,16616764,16625259,16634018,3253076,7652470,10607003,13101504,7695281,10394312,12369372,14342891,6513507,9868950,12434877,14277081].map(xn);ao.scale.quantile=function(){return au([],[])},ao.scale.quantize=function(){return lu(0,1,[0,1])},ao.scale.threshold=function(){return cu([.5],[0,1])},ao.scale.identity=function(){return fu([0,1])},ao.svg={},ao.svg.arc=function(){function n(){var n=Math.max(0,+e.apply(this,arguments)),c=Math.max(0,+r.apply(this,arguments)),f=o.apply(this,arguments)-Io,s=a.apply(this,arguments)-Io,h=Math.abs(s-f),p=f>s?0:1;if(n>c&&(g=c,c=n,n=g),h>=Oo)return t(c,p)+(n?t(n,1-p):"")+"Z";var g,v,d,y,m,M,x,b,_,w,S,k,N=0,E=0,A=[];if((y=(+l.apply(this,arguments)||0)/2)&&(d=u===ql?Math.sqrt(n*n+c*c):+u.apply(this,arguments),p||(E*=-1),c&&(E=tn(d/c*Math.sin(y))),n&&(N=tn(d/n*Math.sin(y)))),c){m=c*Math.cos(f+E),M=c*Math.sin(f+E),x=c*Math.cos(s-E),b=c*Math.sin(s-E);var C=Math.abs(s-f-2*E)<=Fo?0:1;if(E&&yu(m,M,x,b)===p^C){var z=(f+s)/2;m=c*Math.cos(z),M=c*Math.sin(z),x=b=null}}else m=M=0;if(n){_=n*Math.cos(s-N),w=n*Math.sin(s-N),S=n*Math.cos(f+N),k=n*Math.sin(f+N);var L=Math.abs(f-s+2*N)<=Fo?0:1;if(N&&yu(_,w,S,k)===1-p^L){var q=(f+s)/2;_=n*Math.cos(q),w=n*Math.sin(q),S=k=null}}else _=w=0;if(h>Uo&&(g=Math.min(Math.abs(c-n)/2,+i.apply(this,arguments)))>.001){v=c>n^p?0:1;var T=g,R=g;if(Fo>h){var D=null==S?[_,w]:null==x?[m,M]:Re([m,M],[S,k],[x,b],[_,w]),P=m-D[0],U=M-D[1],j=x-D[0],F=b-D[1],H=1/Math.sin(Math.acos((P*j+U*F)/(Math.sqrt(P*P+U*U)*Math.sqrt(j*j+F*F)))/2),O=Math.sqrt(D[0]*D[0]+D[1]*D[1]);R=Math.min(g,(n-O)/(H-1)),T=Math.min(g,(c-O)/(H+1))}if(null!=x){var I=mu(null==S?[_,w]:[S,k],[m,M],c,T,p),Y=mu([x,b],[_,w],c,T,p);g===T?A.push("M",I[0],"A",T,",",T," 0 0,",v," ",I[1],"A",c,",",c," 0 ",1-p^yu(I[1][0],I[1][1],Y[1][0],Y[1][1]),",",p," ",Y[1],"A",T,",",T," 0 0,",v," ",Y[0]):A.push("M",I[0],"A",T,",",T," 0 1,",v," ",Y[0])}else A.push("M",m,",",M);if(null!=S){var Z=mu([m,M],[S,k],n,-R,p),V=mu([_,w],null==x?[m,M]:[x,b],n,-R,p);g===R?A.push("L",V[0],"A",R,",",R," 0 0,",v," ",V[1],"A",n,",",n," 0 ",p^yu(V[1][0],V[1][1],Z[1][0],Z[1][1]),",",1-p," ",Z[1],"A",R,",",R," 0 0,",v," ",Z[0]):A.push("L",V[0],"A",R,",",R," 0 0,",v," ",Z[0])}else A.push("L",_,",",w)}else A.push("M",m,",",M),null!=x&&A.push("A",c,",",c," 0 ",C,",",p," ",x,",",b),A.push("L",_,",",w),null!=S&&A.push("A",n,",",n," 0 ",L,",",1-p," ",S,",",k);return A.push("Z"),A.join("")}function t(n,t){return"M0,"+n+"A"+n+","+n+" 0 1,"+t+" 0,"+-n+"A"+n+","+n+" 0 1,"+t+" 0,"+n}var e=hu,r=pu,i=su,u=ql,o=gu,a=vu,l=du;return n.innerRadius=function(t){return arguments.length?(e=En(t),n):e},n.outerRadius=function(t){return arguments.length?(r=En(t),n):r},n.cornerRadius=function(t){return arguments.length?(i=En(t),n):i},n.padRadius=function(t){return arguments.length?(u=t==ql?ql:En(t),n):u},n.startAngle=function(t){return arguments.length?(o=En(t),n):o},n.endAngle=function(t){return arguments.length?(a=En(t),n):a},n.padAngle=function(t){return arguments.length?(l=En(t),n):l},n.centroid=function(){var n=(+e.apply(this,arguments)+ +r.apply(this,arguments))/2,t=(+o.apply(this,arguments)+ +a.apply(this,arguments))/2-Io;return[Math.cos(t)*n,Math.sin(t)*n]},n};var ql="auto";ao.svg.line=function(){return Mu(m)};var Tl=ao.map({linear:xu,"linear-closed":bu,step:_u,"step-before":wu,"step-after":Su,basis:zu,"basis-open":Lu,"basis-closed":qu,bundle:Tu,cardinal:Eu,"cardinal-open":ku,"cardinal-closed":Nu,monotone:Fu});Tl.forEach(function(n,t){t.key=n,t.closed=/-closed$/.test(n)});var Rl=[0,2/3,1/3,0],Dl=[0,1/3,2/3,0],Pl=[0,1/6,2/3,1/6];ao.svg.line.radial=function(){var n=Mu(Hu);return n.radius=n.x,delete n.x,n.angle=n.y,delete n.y,n},wu.reverse=Su,Su.reverse=wu,ao.svg.area=function(){return Ou(m)},ao.svg.area.radial=function(){var n=Ou(Hu);return n.radius=n.x,delete n.x,n.innerRadius=n.x0,delete n.x0,n.outerRadius=n.x1,delete n.x1,n.angle=n.y,delete n.y,n.startAngle=n.y0,delete n.y0,n.endAngle=n.y1,delete n.y1,n},ao.svg.chord=function(){function n(n,a){var l=t(this,u,n,a),c=t(this,o,n,a);return"M"+l.p0+r(l.r,l.p1,l.a1-l.a0)+(e(l,c)?i(l.r,l.p1,l.r,l.p0):i(l.r,l.p1,c.r,c.p0)+r(c.r,c.p1,c.a1-c.a0)+i(c.r,c.p1,l.r,l.p0))+"Z"}function t(n,t,e,r){var i=t.call(n,e,r),u=a.call(n,i,r),o=l.call(n,i,r)-Io,f=c.call(n,i,r)-Io;return{r:u,a0:o,a1:f,p0:[u*Math.cos(o),u*Math.sin(o)],p1:[u*Math.cos(f),u*Math.sin(f)]}}function e(n,t){return n.a0==t.a0&&n.a1==t.a1}function r(n,t,e){return"A"+n+","+n+" 0 "+ +(e>Fo)+",1 "+t}function i(n,t,e,r){return"Q 0,0 "+r}var u=Me,o=xe,a=Iu,l=gu,c=vu;return n.radius=function(t){return arguments.length?(a=En(t),n):a},n.source=function(t){return arguments.length?(u=En(t),n):u},n.target=function(t){return arguments.length?(o=En(t),n):o},n.startAngle=function(t){return arguments.length?(l=En(t),n):l},n.endAngle=function(t){return arguments.length?(c=En(t),n):c},n},ao.svg.diagonal=function(){function n(n,i){var u=t.call(this,n,i),o=e.call(this,n,i),a=(u.y+o.y)/2,l=[u,{x:u.x,y:a},{x:o.x,y:a},o];return l=l.map(r),"M"+l[0]+"C"+l[1]+" "+l[2]+" "+l[3]}var t=Me,e=xe,r=Yu;return n.source=function(e){return arguments.length?(t=En(e),n):t},n.target=function(t){return arguments.length?(e=En(t),n):e},n.projection=function(t){return arguments.length?(r=t,n):r},n},ao.svg.diagonal.radial=function(){var n=ao.svg.diagonal(),t=Yu,e=n.projection;return n.projection=function(n){return arguments.length?e(Zu(t=n)):t},n},ao.svg.symbol=function(){function n(n,r){return(Ul.get(t.call(this,n,r))||$u)(e.call(this,n,r))}var t=Xu,e=Vu;return n.type=function(e){return arguments.length?(t=En(e),n):t},n.size=function(t){return arguments.length?(e=En(t),n):e},n};var Ul=ao.map({circle:$u,cross:function(n){var t=Math.sqrt(n/5)/2;return"M"+-3*t+","+-t+"H"+-t+"V"+-3*t+"H"+t+"V"+-t+"H"+3*t+"V"+t+"H"+t+"V"+3*t+"H"+-t+"V"+t+"H"+-3*t+"Z"},diamond:function(n){var t=Math.sqrt(n/(2*Fl)),e=t*Fl;return"M0,"+-t+"L"+e+",0 0,"+t+" "+-e+",0Z"},square:function(n){var t=Math.sqrt(n)/2;return"M"+-t+","+-t+"L"+t+","+-t+" "+t+","+t+" "+-t+","+t+"Z"},"triangle-down":function(n){var t=Math.sqrt(n/jl),e=t*jl/2;return"M0,"+e+"L"+t+","+-e+" "+-t+","+-e+"Z"},"triangle-up":function(n){var t=Math.sqrt(n/jl),e=t*jl/2;return"M0,"+-e+"L"+t+","+e+" "+-t+","+e+"Z"}});ao.svg.symbolTypes=Ul.keys();var jl=Math.sqrt(3),Fl=Math.tan(30*Yo);Co.transition=function(n){for(var t,e,r=Hl||++Zl,i=Ku(n),u=[],o=Ol||{time:Date.now(),ease:Nr,delay:0,duration:250},a=-1,l=this.length;++a<l;){u.push(t=[]);for(var c=this[a],f=-1,s=c.length;++f<s;)(e=c[f])&&Qu(e,f,i,r,o),t.push(e)}return Wu(u,i,r)},Co.interrupt=function(n){return this.each(null==n?Il:Bu(Ku(n)))};var Hl,Ol,Il=Bu(Ku()),Yl=[],Zl=0;Yl.call=Co.call,Yl.empty=Co.empty,Yl.node=Co.node,Yl.size=Co.size,ao.transition=function(n,t){return n&&n.transition?Hl?n.transition(t):n:ao.selection().transition(n)},ao.transition.prototype=Yl,Yl.select=function(n){var t,e,r,i=this.id,u=this.namespace,o=[];n=A(n);for(var a=-1,l=this.length;++a<l;){o.push(t=[]);for(var c=this[a],f=-1,s=c.length;++f<s;)(r=c[f])&&(e=n.call(r,r.__data__,f,a))?("__data__"in r&&(e.__data__=r.__data__),Qu(e,f,u,i,r[u][i]),t.push(e)):t.push(null)}return Wu(o,u,i)},Yl.selectAll=function(n){var t,e,r,i,u,o=this.id,a=this.namespace,l=[];n=C(n);for(var c=-1,f=this.length;++c<f;)for(var s=this[c],h=-1,p=s.length;++h<p;)if(r=s[h]){u=r[a][o],e=n.call(r,r.__data__,h,c),l.push(t=[]);for(var g=-1,v=e.length;++g<v;)(i=e[g])&&Qu(i,g,a,o,u),t.push(i)}return Wu(l,a,o)},Yl.filter=function(n){var t,e,r,i=[];"function"!=typeof n&&(n=O(n));for(var u=0,o=this.length;o>u;u++){i.push(t=[]);for(var e=this[u],a=0,l=e.length;l>a;a++)(r=e[a])&&n.call(r,r.__data__,a,u)&&t.push(r)}return Wu(i,this.namespace,this.id)},Yl.tween=function(n,t){var e=this.id,r=this.namespace;return arguments.length<2?this.node()[r][e].tween.get(n):Y(this,null==t?function(t){t[r][e].tween.remove(n)}:function(i){i[r][e].tween.set(n,t)})},Yl.attr=function(n,t){function e(){this.removeAttribute(a)}function r(){this.removeAttributeNS(a.space,a.local)}function i(n){return null==n?e:(n+="",function(){var t,e=this.getAttribute(a);return e!==n&&(t=o(e,n),function(n){this.setAttribute(a,t(n))})})}function u(n){return null==n?r:(n+="",function(){var t,e=this.getAttributeNS(a.space,a.local);return e!==n&&(t=o(e,n),function(n){this.setAttributeNS(a.space,a.local,t(n))})})}if(arguments.length<2){for(t in n)this.attr(t,n[t]);return this}var o="transform"==n?$r:Mr,a=ao.ns.qualify(n);return Ju(this,"attr."+n,t,a.local?u:i)},Yl.attrTween=function(n,t){function e(n,e){var r=t.call(this,n,e,this.getAttribute(i));return r&&function(n){this.setAttribute(i,r(n))}}function r(n,e){var r=t.call(this,n,e,this.getAttributeNS(i.space,i.local));return r&&function(n){this.setAttributeNS(i.space,i.local,r(n))}}var i=ao.ns.qualify(n);return this.tween("attr."+n,i.local?r:e)},Yl.style=function(n,e,r){function i(){this.style.removeProperty(n)}function u(e){return null==e?i:(e+="",function(){var i,u=t(this).getComputedStyle(this,null).getPropertyValue(n);return u!==e&&(i=Mr(u,e),function(t){this.style.setProperty(n,i(t),r)})})}var o=arguments.length;if(3>o){if("string"!=typeof n){2>o&&(e="");for(r in n)this.style(r,n[r],e);return this}r=""}return Ju(this,"style."+n,e,u)},Yl.styleTween=function(n,e,r){function i(i,u){var o=e.call(this,i,u,t(this).getComputedStyle(this,null).getPropertyValue(n));return o&&function(t){this.style.setProperty(n,o(t),r)}}return arguments.length<3&&(r=""),this.tween("style."+n,i)},Yl.text=function(n){return Ju(this,"text",n,Gu)},Yl.remove=function(){var n=this.namespace;return this.each("end.transition",function(){var t;this[n].count<2&&(t=this.parentNode)&&t.removeChild(this)})},Yl.ease=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].ease:("function"!=typeof n&&(n=ao.ease.apply(ao,arguments)),Y(this,function(r){r[e][t].ease=n}))},Yl.delay=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].delay:Y(this,"function"==typeof n?function(r,i,u){r[e][t].delay=+n.call(r,r.__data__,i,u)}:(n=+n,function(r){r[e][t].delay=n}))},Yl.duration=function(n){var t=this.id,e=this.namespace;return arguments.length<1?this.node()[e][t].duration:Y(this,"function"==typeof n?function(r,i,u){r[e][t].duration=Math.max(1,n.call(r,r.__data__,i,u))}:(n=Math.max(1,n),function(r){r[e][t].duration=n}))},Yl.each=function(n,t){var e=this.id,r=this.namespace;if(arguments.length<2){var i=Ol,u=Hl;try{Hl=e,Y(this,function(t,i,u){Ol=t[r][e],n.call(t,t.__data__,i,u)})}finally{Ol=i,Hl=u}}else Y(this,function(i){var u=i[r][e];(u.event||(u.event=ao.dispatch("start","end","interrupt"))).on(n,t)});return this},Yl.transition=function(){for(var n,t,e,r,i=this.id,u=++Zl,o=this.namespace,a=[],l=0,c=this.length;c>l;l++){a.push(n=[]);for(var t=this[l],f=0,s=t.length;s>f;f++)(e=t[f])&&(r=e[o][i],Qu(e,f,o,u,{time:r.time,ease:r.ease,delay:r.delay+r.duration,duration:r.duration})),n.push(e)}return Wu(a,o,u)},ao.svg.axis=function(){function n(n){n.each(function(){var n,c=ao.select(this),f=this.__chart__||e,s=this.__chart__=e.copy(),h=null==l?s.ticks?s.ticks.apply(s,a):s.domain():l,p=null==t?s.tickFormat?s.tickFormat.apply(s,a):m:t,g=c.selectAll(".tick").data(h,s),v=g.enter().insert("g",".domain").attr("class","tick").style("opacity",Uo),d=ao.transition(g.exit()).style("opacity",Uo).remove(),y=ao.transition(g.order()).style("opacity",1),M=Math.max(i,0)+o,x=Zi(s),b=c.selectAll(".domain").data([0]),_=(b.enter().append("path").attr("class","domain"),ao.transition(b));v.append("line"),v.append("text");var w,S,k,N,E=v.select("line"),A=y.select("line"),C=g.select("text").text(p),z=v.select("text"),L=y.select("text"),q="top"===r||"left"===r?-1:1;if("bottom"===r||"top"===r?(n=no,w="x",k="y",S="x2",N="y2",C.attr("dy",0>q?"0em":".71em").style("text-anchor","middle"),_.attr("d","M"+x[0]+","+q*u+"V0H"+x[1]+"V"+q*u)):(n=to,w="y",k="x",S="y2",N="x2",C.attr("dy",".32em").style("text-anchor",0>q?"end":"start"),_.attr("d","M"+q*u+","+x[0]+"H0V"+x[1]+"H"+q*u)),E.attr(N,q*i),z.attr(k,q*M),A.attr(S,0).attr(N,q*i),L.attr(w,0).attr(k,q*M),s.rangeBand){var T=s,R=T.rangeBand()/2;f=s=function(n){return T(n)+R}}else f.rangeBand?f=s:d.call(n,s,f);v.call(n,f,s),y.call(n,s,s)})}var t,e=ao.scale.linear(),r=Vl,i=6,u=6,o=3,a=[10],l=null;return n.scale=function(t){return arguments.length?(e=t,n):e},n.orient=function(t){return arguments.length?(r=t in Xl?t+"":Vl,n):r},n.ticks=function(){return arguments.length?(a=co(arguments),n):a},n.tickValues=function(t){return arguments.length?(l=t,n):l},n.tickFormat=function(e){return arguments.length?(t=e,n):t},n.tickSize=function(t){var e=arguments.length;return e?(i=+t,u=+arguments[e-1],n):i},n.innerTickSize=function(t){return arguments.length?(i=+t,n):i},n.outerTickSize=function(t){return arguments.length?(u=+t,n):u},n.tickPadding=function(t){return arguments.length?(o=+t,n):o},n.tickSubdivide=function(){return arguments.length&&n},n};var Vl="bottom",Xl={top:1,right:1,bottom:1,left:1};ao.svg.brush=function(){function n(t){t.each(function(){var t=ao.select(this).style("pointer-events","all").style("-webkit-tap-highlight-color","rgba(0,0,0,0)").on("mousedown.brush",u).on("touchstart.brush",u),o=t.selectAll(".background").data([0]);o.enter().append("rect").attr("class","background").style("visibility","hidden").style("cursor","crosshair"),t.selectAll(".extent").data([0]).enter().append("rect").attr("class","extent").style("cursor","move");var a=t.selectAll(".resize").data(v,m);a.exit().remove(),a.enter().append("g").attr("class",function(n){return"resize "+n}).style("cursor",function(n){return $l[n]}).append("rect").attr("x",function(n){return/[ew]$/.test(n)?-3:null}).attr("y",function(n){return/^[ns]/.test(n)?-3:null}).attr("width",6).attr("height",6).style("visibility","hidden"),a.style("display",n.empty()?"none":null);var l,s=ao.transition(t),h=ao.transition(o);c&&(l=Zi(c),h.attr("x",l[0]).attr("width",l[1]-l[0]),r(s)),f&&(l=Zi(f),h.attr("y",l[0]).attr("height",l[1]-l[0]),i(s)),e(s)})}function e(n){n.selectAll(".resize").attr("transform",function(n){return"translate("+s[+/e$/.test(n)]+","+h[+/^s/.test(n)]+")"})}function r(n){n.select(".extent").attr("x",s[0]),n.selectAll(".extent,.n>rect,.s>rect").attr("width",s[1]-s[0])}function i(n){n.select(".extent").attr("y",h[0]),n.selectAll(".extent,.e>rect,.w>rect").attr("height",h[1]-h[0])}function u(){function u(){32==ao.event.keyCode&&(C||(M=null,L[0]-=s[1],L[1]-=h[1],C=2),S())}function v(){32==ao.event.keyCode&&2==C&&(L[0]+=s[1],L[1]+=h[1],C=0,S())}function d(){var n=ao.mouse(b),t=!1;x&&(n[0]+=x[0],n[1]+=x[1]),C||(ao.event.altKey?(M||(M=[(s[0]+s[1])/2,(h[0]+h[1])/2]),L[0]=s[+(n[0]<M[0])],L[1]=h[+(n[1]<M[1])]):M=null),E&&y(n,c,0)&&(r(k),t=!0),A&&y(n,f,1)&&(i(k),t=!0),t&&(e(k),w({type:"brush",mode:C?"move":"resize"}))}function y(n,t,e){var r,i,u=Zi(t),l=u[0],c=u[1],f=L[e],v=e?h:s,d=v[1]-v[0];return C&&(l-=f,c-=d+f),r=(e?g:p)?Math.max(l,Math.min(c,n[e])):n[e],C?i=(r+=f)+d:(M&&(f=Math.max(l,Math.min(c,2*M[e]-r))),r>f?(i=r,r=f):i=f),v[0]!=r||v[1]!=i?(e?a=null:o=null,v[0]=r,v[1]=i,!0):void 0}function m(){d(),k.style("pointer-events","all").selectAll(".resize").style("display",n.empty()?"none":null),ao.select("body").style("cursor",null),q.on("mousemove.brush",null).on("mouseup.brush",null).on("touchmove.brush",null).on("touchend.brush",null).on("keydown.brush",null).on("keyup.brush",null),z(),w({type:"brushend"})}var M,x,b=this,_=ao.select(ao.event.target),w=l.of(b,arguments),k=ao.select(b),N=_.datum(),E=!/^(n|s)$/.test(N)&&c,A=!/^(e|w)$/.test(N)&&f,C=_.classed("extent"),z=W(b),L=ao.mouse(b),q=ao.select(t(b)).on("keydown.brush",u).on("keyup.brush",v);if(ao.event.changedTouches?q.on("touchmove.brush",d).on("touchend.brush",m):q.on("mousemove.brush",d).on("mouseup.brush",m),k.interrupt().selectAll("*").interrupt(),C)L[0]=s[0]-L[0],L[1]=h[0]-L[1];else if(N){var T=+/w$/.test(N),R=+/^n/.test(N);x=[s[1-T]-L[0],h[1-R]-L[1]],L[0]=s[T],L[1]=h[R]}else ao.event.altKey&&(M=L.slice());k.style("pointer-events","none").selectAll(".resize").style("display",null),ao.select("body").style("cursor",_.style("cursor")),w({type:"brushstart"}),d()}var o,a,l=N(n,"brushstart","brush","brushend"),c=null,f=null,s=[0,0],h=[0,0],p=!0,g=!0,v=Bl[0];return n.event=function(n){n.each(function(){var n=l.of(this,arguments),t={x:s,y:h,i:o,j:a},e=this.__chart__||t;this.__chart__=t,Hl?ao.select(this).transition().each("start.brush",function(){o=e.i,a=e.j,s=e.x,h=e.y,n({type:"brushstart"})}).tween("brush:brush",function(){var e=xr(s,t.x),r=xr(h,t.y);return o=a=null,function(i){s=t.x=e(i),h=t.y=r(i),n({type:"brush",mode:"resize"})}}).each("end.brush",function(){o=t.i,a=t.j,n({type:"brush",mode:"resize"}),n({type:"brushend"})}):(n({type:"brushstart"}),n({type:"brush",mode:"resize"}),n({type:"brushend"}))})},n.x=function(t){return arguments.length?(c=t,v=Bl[!c<<1|!f],n):c},n.y=function(t){return arguments.length?(f=t,v=Bl[!c<<1|!f],n):f},n.clamp=function(t){return arguments.length?(c&&f?(p=!!t[0],g=!!t[1]):c?p=!!t:f&&(g=!!t),n):c&&f?[p,g]:c?p:f?g:null},n.extent=function(t){var e,r,i,u,l;return arguments.length?(c&&(e=t[0],r=t[1],f&&(e=e[0],r=r[0]),o=[e,r],c.invert&&(e=c(e),r=c(r)),e>r&&(l=e,e=r,r=l),e==s[0]&&r==s[1]||(s=[e,r])),f&&(i=t[0],u=t[1],c&&(i=i[1],u=u[1]),a=[i,u],f.invert&&(i=f(i),u=f(u)),i>u&&(l=i,i=u,u=l),i==h[0]&&u==h[1]||(h=[i,u])),n):(c&&(o?(e=o[0],r=o[1]):(e=s[0],r=s[1],c.invert&&(e=c.invert(e),r=c.invert(r)),e>r&&(l=e,e=r,r=l))),f&&(a?(i=a[0],u=a[1]):(i=h[0],u=h[1],f.invert&&(i=f.invert(i),u=f.invert(u)),i>u&&(l=i,i=u,u=l))),c&&f?[[e,i],[r,u]]:c?[e,r]:f&&[i,u])},n.clear=function(){return n.empty()||(s=[0,0],h=[0,0],o=a=null),n},n.empty=function(){return!!c&&s[0]==s[1]||!!f&&h[0]==h[1]},ao.rebind(n,l,"on")};var $l={n:"ns-resize",e:"ew-resize",s:"ns-resize",w:"ew-resize",nw:"nwse-resize",ne:"nesw-resize",se:"nwse-resize",sw:"nesw-resize"},Bl=[["n","e","s","w","nw","ne","se","sw"],["e","w"],["n","s"],[]],Wl=ga.format=xa.timeFormat,Jl=Wl.utc,Gl=Jl("%Y-%m-%dT%H:%M:%S.%LZ");Wl.iso=Date.prototype.toISOString&&+new Date("2000-01-01T00:00:00.000Z")?eo:Gl,eo.parse=function(n){var t=new Date(n);return isNaN(t)?null:t},eo.toString=Gl.toString,ga.second=On(function(n){return new va(1e3*Math.floor(n/1e3))},function(n,t){n.setTime(n.getTime()+1e3*Math.floor(t))},function(n){return n.getSeconds()}),ga.seconds=ga.second.range,ga.seconds.utc=ga.second.utc.range,ga.minute=On(function(n){return new va(6e4*Math.floor(n/6e4))},function(n,t){n.setTime(n.getTime()+6e4*Math.floor(t))},function(n){return n.getMinutes()}),ga.minutes=ga.minute.range,ga.minutes.utc=ga.minute.utc.range,ga.hour=On(function(n){var t=n.getTimezoneOffset()/60;return new va(36e5*(Math.floor(n/36e5-t)+t))},function(n,t){n.setTime(n.getTime()+36e5*Math.floor(t))},function(n){return n.getHours()}),ga.hours=ga.hour.range,ga.hours.utc=ga.hour.utc.range,ga.month=On(function(n){return n=ga.day(n),n.setDate(1),n},function(n,t){n.setMonth(n.getMonth()+t)},function(n){return n.getMonth()}),ga.months=ga.month.range,ga.months.utc=ga.month.utc.range;var Kl=[1e3,5e3,15e3,3e4,6e4,3e5,9e5,18e5,36e5,108e5,216e5,432e5,864e5,1728e5,6048e5,2592e6,7776e6,31536e6],Ql=[[ga.second,1],[ga.second,5],[ga.second,15],[ga.second,30],[ga.minute,1],[ga.minute,5],[ga.minute,15],[ga.minute,30],[ga.hour,1],[ga.hour,3],[ga.hour,6],[ga.hour,12],[ga.day,1],[ga.day,2],[ga.week,1],[ga.month,1],[ga.month,3],[ga.year,1]],nc=Wl.multi([[".%L",function(n){return n.getMilliseconds()}],[":%S",function(n){return n.getSeconds()}],["%I:%M",function(n){return n.getMinutes()}],["%I %p",function(n){return n.getHours()}],["%a %d",function(n){return n.getDay()&&1!=n.getDate()}],["%b %d",function(n){return 1!=n.getDate()}],["%B",function(n){return n.getMonth()}],["%Y",zt]]),tc={range:function(n,t,e){return ao.range(Math.ceil(n/e)*e,+t,e).map(io)},floor:m,ceil:m};Ql.year=ga.year,ga.scale=function(){return ro(ao.scale.linear(),Ql,nc)};var ec=Ql.map(function(n){return[n[0].utc,n[1]]}),rc=Jl.multi([[".%L",function(n){return n.getUTCMilliseconds()}],[":%S",function(n){return n.getUTCSeconds()}],["%I:%M",function(n){return n.getUTCMinutes()}],["%I %p",function(n){return n.getUTCHours()}],["%a %d",function(n){return n.getUTCDay()&&1!=n.getUTCDate()}],["%b %d",function(n){return 1!=n.getUTCDate()}],["%B",function(n){return n.getUTCMonth()}],["%Y",zt]]);ec.year=ga.year.utc,ga.scale.utc=function(){return ro(ao.scale.linear(),ec,rc)},ao.text=An(function(n){return n.responseText}),ao.json=function(n,t){return Cn(n,"application/json",uo,t)},ao.html=function(n,t){return Cn(n,"text/html",oo,t)},ao.xml=An(function(n){return n.responseXML}),"function"==typeof define&&define.amd?(this.d3=ao,define(ao)):"object"==typeof module&&module.exports?module.exports=ao:this.d3=ao}();
/* @preserve
 * Leaflet 1.3.1+Detached: ba6f97fff8647e724e4dfe66d2ed7da11f908989.ba6f97f, a JS library for interactive maps. http://leafletjs.com
 * (c) 2010-2017 Vladimir Agafonkin, (c) 2010-2011 CloudMade
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.L = {})));
}(this, (function (exports) { 'use strict';

var version = "1.3.1+HEAD.ba6f97f";

/*
 * @namespace Util
 *
 * Various utility functions, used by Leaflet internally.
 */

var freeze = Object.freeze;
Object.freeze = function (obj) { return obj; };

// @function extend(dest: Object, src?: Object): Object
// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
function extend(dest) {
	var i, j, len, src;

	for (j = 1, len = arguments.length; j < len; j++) {
		src = arguments[j];
		for (i in src) {
			dest[i] = src[i];
		}
	}
	return dest;
}

// @function create(proto: Object, properties?: Object): Object
// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
var create = Object.create || (function () {
	function F() {}
	return function (proto) {
		F.prototype = proto;
		return new F();
	};
})();

// @function bind(fn: Function, …): Function
// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
// Has a `L.bind()` shortcut.
function bind(fn, obj) {
	var slice = Array.prototype.slice;

	if (fn.bind) {
		return fn.bind.apply(fn, slice.call(arguments, 1));
	}

	var args = slice.call(arguments, 2);

	return function () {
		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	};
}

// @property lastId: Number
// Last unique ID used by [`stamp()`](#util-stamp)
var lastId = 0;

// @function stamp(obj: Object): Number
// Returns the unique ID of an object, assigning it one if it doesn't have it.
function stamp(obj) {
	/*eslint-disable */
	obj._leaflet_id = obj._leaflet_id || ++lastId;
	return obj._leaflet_id;
	/* eslint-enable */
}

// @function throttle(fn: Function, time: Number, context: Object): Function
// Returns a function which executes function `fn` with the given scope `context`
// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
// `fn` will be called no more than one time per given amount of `time`. The arguments
// received by the bound function will be any arguments passed when binding the
// function, followed by any arguments passed when invoking the bound function.
// Has an `L.throttle` shortcut.
function throttle(fn, time, context) {
	var lock, args, wrapperFn, later;

	later = function () {
		// reset lock and call if queued
		lock = false;
		if (args) {
			wrapperFn.apply(context, args);
			args = false;
		}
	};

	wrapperFn = function () {
		if (lock) {
			// called too soon, queue to call later
			args = arguments;

		} else {
			// call and lock until later
			fn.apply(context, arguments);
			setTimeout(later, time);
			lock = true;
		}
	};

	return wrapperFn;
}

// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
// Returns the number `num` modulo `range` in such a way so it lies within
// `range[0]` and `range[1]`. The returned value will be always smaller than
// `range[1]` unless `includeMax` is set to `true`.
function wrapNum(x, range, includeMax) {
	var max = range[1],
	    min = range[0],
	    d = max - min;
	return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
}

// @function falseFn(): Function
// Returns a function which always returns `false`.
function falseFn() { return false; }

// @function formatNum(num: Number, digits?: Number): Number
// Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
function formatNum(num, digits) {
	var pow = Math.pow(10, (digits === undefined ? 6 : digits));
	return Math.round(num * pow) / pow;
}

// @function trim(str: String): String
// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
function trim(str) {
	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
function splitWords(str) {
	return trim(str).split(/\s+/);
}

// @function setOptions(obj: Object, options: Object): Object
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
function setOptions(obj, options) {
	if (!obj.hasOwnProperty('options')) {
		obj.options = obj.options ? create(obj.options) : {};
	}
	for (var i in options) {
		obj.options[i] = options[i];
	}
	return obj.options;
}

// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
// be appended at the end. If `uppercase` is `true`, the parameter names will
// be uppercased (e.g. `'?A=foo&B=bar'`)
function getParamString(obj, existingUrl, uppercase) {
	var params = [];
	for (var i in obj) {
		params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
	}
	return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
}

var templateRe = /\{ *([\w_-]+) *\}/g;

// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values — they will be evaluated passing `data` as an argument.
function template(str, data) {
	return str.replace(templateRe, function (str, key) {
		var value = data[key];

		if (value === undefined) {
			throw new Error('No value provided for variable ' + str);

		} else if (typeof value === 'function') {
			value = value(data);
		}
		return value;
	});
}

// @function isArray(obj): Boolean
// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
var isArray = Array.isArray || function (obj) {
	return (Object.prototype.toString.call(obj) === '[object Array]');
};

// @function indexOf(array: Array, el: Object): Number
// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
function indexOf(array, el) {
	for (var i = 0; i < array.length; i++) {
		if (array[i] === el) { return i; }
	}
	return -1;
}

// @property emptyImageUrl: String
// Data URI string containing a base64-encoded empty GIF image.
// Used as a hack to free memory from unused images on WebKit-powered
// mobile devices (by setting image `src` to this string).
var emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

function getPrefixed(name) {
	return window['webkit' + name] || window['moz' + name] || window['ms' + name];
}

var lastTime = 0;

// fallback for IE 7-8
function timeoutDefer(fn) {
	var time = +new Date(),
	    timeToCall = Math.max(0, 16 - (time - lastTime));

	lastTime = time + timeToCall;
	return window.setTimeout(fn, timeToCall);
}

var requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
var cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
// `context` if given. When `immediate` is set, `fn` is called immediately if
// the browser doesn't have native support for
// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
function requestAnimFrame(fn, context, immediate) {
	if (immediate && requestFn === timeoutDefer) {
		fn.call(context);
	} else {
		return requestFn.call(window, bind(fn, context));
	}
}

// @function cancelAnimFrame(id: Number): undefined
// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
function cancelAnimFrame(id) {
	if (id) {
		cancelFn.call(window, id);
	}
}


var Util = (Object.freeze || Object)({
	freeze: freeze,
	extend: extend,
	create: create,
	bind: bind,
	lastId: lastId,
	stamp: stamp,
	throttle: throttle,
	wrapNum: wrapNum,
	falseFn: falseFn,
	formatNum: formatNum,
	trim: trim,
	splitWords: splitWords,
	setOptions: setOptions,
	getParamString: getParamString,
	template: template,
	isArray: isArray,
	indexOf: indexOf,
	emptyImageUrl: emptyImageUrl,
	requestFn: requestFn,
	cancelFn: cancelFn,
	requestAnimFrame: requestAnimFrame,
	cancelAnimFrame: cancelAnimFrame
});

// @class Class
// @aka L.Class

// @section
// @uninheritable

// Thanks to John Resig and Dean Edwards for inspiration!

function Class() {}

Class.extend = function (props) {

	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	var NewClass = function () {

		// call the constructor
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}

		// call all constructor hooks
		this.callInitHooks();
	};

	var parentProto = NewClass.__super__ = this.prototype;

	var proto = create(parentProto);
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	// inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype' && i !== '__super__') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		checkDeprecatedMixinEvents(props.includes);
		extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (proto.options) {
		props.options = extend(create(proto.options), props.options);
	}

	// mix given properties into the prototype
	extend(proto, props);

	proto._initHooks = [];

	// add method for calling all hooks
	proto.callInitHooks = function () {

		if (this._initHooksCalled) { return; }

		if (parentProto.callInitHooks) {
			parentProto.callInitHooks.call(this);
		}

		this._initHooksCalled = true;

		for (var i = 0, len = proto._initHooks.length; i < len; i++) {
			proto._initHooks[i].call(this);
		}
	};

	return NewClass;
};


// @function include(properties: Object): this
// [Includes a mixin](#class-includes) into the current class.
Class.include = function (props) {
	extend(this.prototype, props);
	return this;
};

// @function mergeOptions(options: Object): this
// [Merges `options`](#class-options) into the defaults of the class.
Class.mergeOptions = function (options) {
	extend(this.prototype.options, options);
	return this;
};

// @function addInitHook(fn: Function): this
// Adds a [constructor hook](#class-constructor-hooks) to the class.
Class.addInitHook = function (fn) { // (Function) || (String, args...)
	var args = Array.prototype.slice.call(arguments, 1);

	var init = typeof fn === 'function' ? fn : function () {
		this[fn].apply(this, args);
	};

	this.prototype._initHooks = this.prototype._initHooks || [];
	this.prototype._initHooks.push(init);
	return this;
};

function checkDeprecatedMixinEvents(includes) {
	if (typeof L === 'undefined' || !L || !L.Mixin) { return; }

	includes = isArray(includes) ? includes : [includes];

	for (var i = 0; i < includes.length; i++) {
		if (includes[i] === L.Mixin.Events) {
			console.warn('Deprecated include of L.Mixin.Events: ' +
				'this property will be removed in future releases, ' +
				'please inherit from L.Evented instead.', new Error().stack);
		}
	}
}

/*
 * @class Evented
 * @aka L.Evented
 * @inherits Class
 *
 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
 *
 * @example
 *
 * ```js
 * map.on('click', function(e) {
 * 	alert(e.latlng);
 * } );
 * ```
 *
 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
 *
 * ```js
 * function onClick(e) { ... }
 *
 * map.on('click', onClick);
 * map.off('click', onClick);
 * ```
 */

var Events = {
	/* @method on(type: String, fn: Function, context?: Object): this
	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
	 *
	 * @alternative
	 * @method on(eventMap: Object): this
	 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	 */
	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	/* @method off(type: String, fn?: Function, context?: Object): this
	 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
	 *
	 * @alternative
	 * @method off(eventMap: Object): this
	 * Removes a set of type/listener pairs.
	 *
	 * @alternative
	 * @method off: this
	 * Removes all listeners to all events on the object.
	 */
	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {
		this._events = this._events || {};

		/* get/init listeners for type */
		var typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}
		var newListener = {fn: fn, ctx: context},
		    listeners = typeListeners;

		// check if fn already there
		for (var i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i].fn === fn && listeners[i].ctx === context) {
				return;
			}
		}

		listeners.push(newListener);
	},

	_off: function (type, fn, context) {
		var listeners,
		    i,
		    len;

		if (!this._events) { return; }

		listeners = this._events[type];

		if (!listeners) {
			return;
		}

		if (!fn) {
			// Set all removed listeners to noop so they are not called if remove happens in fire
			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].fn = falseFn;
			}
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		if (context === this) {
			context = undefined;
		}

		if (listeners) {

			// find fn and remove it
			for (i = 0, len = listeners.length; i < len; i++) {
				var l = listeners[i];
				if (l.ctx !== context) { continue; }
				if (l.fn === fn) {

					// set the removed listener to noop so that's not called if remove happens in fire
					l.fn = falseFn;

					if (this._firingCount) {
						/* copy array in case events are being fired */
						this._events[type] = listeners = listeners.slice();
					}
					listeners.splice(i, 1);

					return;
				}
			}
		}
	},

	// @method fire(type: String, data?: Object, propagate?: Boolean): this
	// Fires an event of the specified type. You can optionally provide an data
	// object — the first argument of the listener function will contain its
	// properties. The event can optionally be propagated to event parents.
	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = extend({}, data, {
			type: type,
			target: this,
			sourceTarget: data && data.sourceTarget || this
		});

		if (this._events) {
			var listeners = this._events[type];

			if (listeners) {
				this._firingCount = (this._firingCount + 1) || 1;
				for (var i = 0, len = listeners.length; i < len; i++) {
					var l = listeners[i];
					l.fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	// @method listens(type: String): Boolean
	// Returns `true` if a particular event type has any listeners attached to it.
	listens: function (type, propagate) {
		var listeners = this._events && this._events[type];
		if (listeners && listeners.length) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	// @method once(…): this
	// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = bind(function () {
			this
			    .off(types, fn, context)
			    .off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

	// @method addEventParent(obj: Evented): this
	// Adds an event parent - an `Evented` that will receive propagated events
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[stamp(obj)] = obj;
		return this;
	},

	// @method removeEventParent(obj: Evented): this
	// Removes an event parent, so it will stop receiving propagated events
	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, extend({
				layer: e.target,
				propagatedFrom: e.target
			}, e), true);
		}
	}
};

// aliases; we should ditch those eventually

// @method addEventListener(…): this
// Alias to [`on(…)`](#evented-on)
Events.addEventListener = Events.on;

// @method removeEventListener(…): this
// Alias to [`off(…)`](#evented-off)

// @method clearAllEventListeners(…): this
// Alias to [`off()`](#evented-off)
Events.removeEventListener = Events.clearAllEventListeners = Events.off;

// @method addOneTimeEventListener(…): this
// Alias to [`once(…)`](#evented-once)
Events.addOneTimeEventListener = Events.once;

// @method fireEvent(…): this
// Alias to [`fire(…)`](#evented-fire)
Events.fireEvent = Events.fire;

// @method hasEventListeners(…): Boolean
// Alias to [`listens(…)`](#evented-listens)
Events.hasEventListeners = Events.listens;

var Evented = Class.extend(Events);

/*
 * @class Point
 * @aka L.Point
 *
 * Represents a point with `x` and `y` coordinates in pixels.
 *
 * @example
 *
 * ```js
 * var point = L.point(200, 300);
 * ```
 *
 * All Leaflet methods and options that accept `Point` objects also accept them in a simple Array form (unless noted otherwise), so these lines are equivalent:
 *
 * ```js
 * map.panBy([200, 300]);
 * map.panBy(L.point(200, 300));
 * ```
 *
 * Note that `Point` does not inherit from Leafet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function Point(x, y, round) {
	// @property x: Number; The `x` coordinate of the point
	this.x = (round ? Math.round(x) : x);
	// @property y: Number; The `y` coordinate of the point
	this.y = (round ? Math.round(y) : y);
}

var trunc = Math.trunc || function (v) {
	return v > 0 ? Math.floor(v) : Math.ceil(v);
};

Point.prototype = {

	// @method clone(): Point
	// Returns a copy of the current point.
	clone: function () {
		return new Point(this.x, this.y);
	},

	// @method add(otherPoint: Point): Point
	// Returns the result of addition of the current and the given points.
	add: function (point) {
		// non-destructive, returns a new point
		return this.clone()._add(toPoint(point));
	},

	_add: function (point) {
		// destructive, used directly for performance in situations where it's safe to modify existing point
		this.x += point.x;
		this.y += point.y;
		return this;
	},

	// @method subtract(otherPoint: Point): Point
	// Returns the result of subtraction of the given point from the current.
	subtract: function (point) {
		return this.clone()._subtract(toPoint(point));
	},

	_subtract: function (point) {
		this.x -= point.x;
		this.y -= point.y;
		return this;
	},

	// @method divideBy(num: Number): Point
	// Returns the result of division of the current point by the given number.
	divideBy: function (num) {
		return this.clone()._divideBy(num);
	},

	_divideBy: function (num) {
		this.x /= num;
		this.y /= num;
		return this;
	},

	// @method multiplyBy(num: Number): Point
	// Returns the result of multiplication of the current point by the given number.
	multiplyBy: function (num) {
		return this.clone()._multiplyBy(num);
	},

	_multiplyBy: function (num) {
		this.x *= num;
		this.y *= num;
		return this;
	},

	// @method scaleBy(scale: Point): Point
	// Multiply each coordinate of the current point by each coordinate of
	// `scale`. In linear algebra terms, multiply the point by the
	// [scaling matrix](https://en.wikipedia.org/wiki/Scaling_%28geometry%29#Matrix_representation)
	// defined by `scale`.
	scaleBy: function (point) {
		return new Point(this.x * point.x, this.y * point.y);
	},

	// @method unscaleBy(scale: Point): Point
	// Inverse of `scaleBy`. Divide each coordinate of the current point by
	// each coordinate of `scale`.
	unscaleBy: function (point) {
		return new Point(this.x / point.x, this.y / point.y);
	},

	// @method round(): Point
	// Returns a copy of the current point with rounded coordinates.
	round: function () {
		return this.clone()._round();
	},

	_round: function () {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		return this;
	},

	// @method floor(): Point
	// Returns a copy of the current point with floored coordinates (rounded down).
	floor: function () {
		return this.clone()._floor();
	},

	_floor: function () {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		return this;
	},

	// @method ceil(): Point
	// Returns a copy of the current point with ceiled coordinates (rounded up).
	ceil: function () {
		return this.clone()._ceil();
	},

	_ceil: function () {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		return this;
	},

	// @method trunc(): Point
	// Returns a copy of the current point with truncated coordinates (rounded towards zero).
	trunc: function () {
		return this.clone()._trunc();
	},

	_trunc: function () {
		this.x = trunc(this.x);
		this.y = trunc(this.y);
		return this;
	},

	// @method distanceTo(otherPoint: Point): Number
	// Returns the cartesian distance between the current and the given points.
	distanceTo: function (point) {
		point = toPoint(point);

		var x = point.x - this.x,
		    y = point.y - this.y;

		return Math.sqrt(x * x + y * y);
	},

	// @method equals(otherPoint: Point): Boolean
	// Returns `true` if the given point has the same coordinates.
	equals: function (point) {
		point = toPoint(point);

		return point.x === this.x &&
		       point.y === this.y;
	},

	// @method contains(otherPoint: Point): Boolean
	// Returns `true` if both coordinates of the given point are less than the corresponding current point coordinates (in absolute values).
	contains: function (point) {
		point = toPoint(point);

		return Math.abs(point.x) <= Math.abs(this.x) &&
		       Math.abs(point.y) <= Math.abs(this.y);
	},

	// @method toString(): String
	// Returns a string representation of the point for debugging purposes.
	toString: function () {
		return 'Point(' +
		        formatNum(this.x) + ', ' +
		        formatNum(this.y) + ')';
	}
};

// @factory L.point(x: Number, y: Number, round?: Boolean)
// Creates a Point object with the given `x` and `y` coordinates. If optional `round` is set to true, rounds the `x` and `y` values.

// @alternative
// @factory L.point(coords: Number[])
// Expects an array of the form `[x, y]` instead.

// @alternative
// @factory L.point(coords: Object)
// Expects a plain object of the form `{x: Number, y: Number}` instead.
function toPoint(x, y, round) {
	if (x instanceof Point) {
		return x;
	}
	if (isArray(x)) {
		return new Point(x[0], x[1]);
	}
	if (x === undefined || x === null) {
		return x;
	}
	if (typeof x === 'object' && 'x' in x && 'y' in x) {
		return new Point(x.x, x.y);
	}
	return new Point(x, y, round);
}

/*
 * @class Bounds
 * @aka L.Bounds
 *
 * Represents a rectangular area in pixel coordinates.
 *
 * @example
 *
 * ```js
 * var p1 = L.point(10, 10),
 * p2 = L.point(40, 60),
 * bounds = L.bounds(p1, p2);
 * ```
 *
 * All Leaflet methods that accept `Bounds` objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```js
 * otherBounds.intersects([[10, 10], [40, 60]]);
 * ```
 *
 * Note that `Bounds` does not inherit from Leafet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function Bounds(a, b) {
	if (!a) { return; }

	var points = b ? [a, b] : a;

	for (var i = 0, len = points.length; i < len; i++) {
		this.extend(points[i]);
	}
}

Bounds.prototype = {
	// @method extend(point: Point): this
	// Extends the bounds to contain the given point.
	extend: function (point) { // (Point)
		point = toPoint(point);

		// @property min: Point
		// The top left corner of the rectangle.
		// @property max: Point
		// The bottom right corner of the rectangle.
		if (!this.min && !this.max) {
			this.min = point.clone();
			this.max = point.clone();
		} else {
			this.min.x = Math.min(point.x, this.min.x);
			this.max.x = Math.max(point.x, this.max.x);
			this.min.y = Math.min(point.y, this.min.y);
			this.max.y = Math.max(point.y, this.max.y);
		}
		return this;
	},

	// @method getCenter(round?: Boolean): Point
	// Returns the center point of the bounds.
	getCenter: function (round) {
		return new Point(
		        (this.min.x + this.max.x) / 2,
		        (this.min.y + this.max.y) / 2, round);
	},

	// @method getBottomLeft(): Point
	// Returns the bottom-left point of the bounds.
	getBottomLeft: function () {
		return new Point(this.min.x, this.max.y);
	},

	// @method getTopRight(): Point
	// Returns the top-right point of the bounds.
	getTopRight: function () { // -> Point
		return new Point(this.max.x, this.min.y);
	},

	// @method getTopLeft(): Point
	// Returns the top-left point of the bounds (i.e. [`this.min`](#bounds-min)).
	getTopLeft: function () {
		return this.min; // left, top
	},

	// @method getBottomRight(): Point
	// Returns the bottom-right point of the bounds (i.e. [`this.max`](#bounds-max)).
	getBottomRight: function () {
		return this.max; // right, bottom
	},

	// @method getSize(): Point
	// Returns the size of the given bounds
	getSize: function () {
		return this.max.subtract(this.min);
	},

	// @method contains(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle contains the given one.
	// @alternative
	// @method contains(point: Point): Boolean
	// Returns `true` if the rectangle contains the given point.
	contains: function (obj) {
		var min, max;

		if (typeof obj[0] === 'number' || obj instanceof Point) {
			obj = toPoint(obj);
		} else {
			obj = toBounds(obj);
		}

		if (obj instanceof Bounds) {
			min = obj.min;
			max = obj.max;
		} else {
			min = max = obj;
		}

		return (min.x >= this.min.x) &&
		       (max.x <= this.max.x) &&
		       (min.y >= this.min.y) &&
		       (max.y <= this.max.y);
	},

	// @method intersects(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle intersects the given bounds. Two bounds
	// intersect if they have at least one point in common.
	intersects: function (bounds) { // (Bounds) -> Boolean
		bounds = toBounds(bounds);

		var min = this.min,
		    max = this.max,
		    min2 = bounds.min,
		    max2 = bounds.max,
		    xIntersects = (max2.x >= min.x) && (min2.x <= max.x),
		    yIntersects = (max2.y >= min.y) && (min2.y <= max.y);

		return xIntersects && yIntersects;
	},

	// @method overlaps(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle overlaps the given bounds. Two bounds
	// overlap if their intersection is an area.
	overlaps: function (bounds) { // (Bounds) -> Boolean
		bounds = toBounds(bounds);

		var min = this.min,
		    max = this.max,
		    min2 = bounds.min,
		    max2 = bounds.max,
		    xOverlaps = (max2.x > min.x) && (min2.x < max.x),
		    yOverlaps = (max2.y > min.y) && (min2.y < max.y);

		return xOverlaps && yOverlaps;
	},

	isValid: function () {
		return !!(this.min && this.max);
	}
};


// @factory L.bounds(corner1: Point, corner2: Point)
// Creates a Bounds object from two corners coordinate pairs.
// @alternative
// @factory L.bounds(points: Point[])
// Creates a Bounds object from the given array of points.
function toBounds(a, b) {
	if (!a || a instanceof Bounds) {
		return a;
	}
	return new Bounds(a, b);
}

/*
 * @class LatLngBounds
 * @aka L.LatLngBounds
 *
 * Represents a rectangular geographical area on a map.
 *
 * @example
 *
 * ```js
 * var corner1 = L.latLng(40.712, -74.227),
 * corner2 = L.latLng(40.774, -74.125),
 * bounds = L.latLngBounds(corner1, corner2);
 * ```
 *
 * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```js
 * map.fitBounds([
 * 	[40.712, -74.227],
 * 	[40.774, -74.125]
 * ]);
 * ```
 *
 * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
 *
 * Note that `LatLngBounds` does not inherit from Leafet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function LatLngBounds(corner1, corner2) { // (LatLng, LatLng) or (LatLng[])
	if (!corner1) { return; }

	var latlngs = corner2 ? [corner1, corner2] : corner1;

	for (var i = 0, len = latlngs.length; i < len; i++) {
		this.extend(latlngs[i]);
	}
}

LatLngBounds.prototype = {

	// @method extend(latlng: LatLng): this
	// Extend the bounds to contain the given point

	// @alternative
	// @method extend(otherBounds: LatLngBounds): this
	// Extend the bounds to contain the given bounds
	extend: function (obj) {
		var sw = this._southWest,
		    ne = this._northEast,
		    sw2, ne2;

		if (obj instanceof LatLng) {
			sw2 = obj;
			ne2 = obj;

		} else if (obj instanceof LatLngBounds) {
			sw2 = obj._southWest;
			ne2 = obj._northEast;

			if (!sw2 || !ne2) { return this; }

		} else {
			return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
		}

		if (!sw && !ne) {
			this._southWest = new LatLng(sw2.lat, sw2.lng);
			this._northEast = new LatLng(ne2.lat, ne2.lng);
		} else {
			sw.lat = Math.min(sw2.lat, sw.lat);
			sw.lng = Math.min(sw2.lng, sw.lng);
			ne.lat = Math.max(ne2.lat, ne.lat);
			ne.lng = Math.max(ne2.lng, ne.lng);
		}

		return this;
	},

	// @method pad(bufferRatio: Number): LatLngBounds
	// Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
	// For example, a ratio of 0.5 extends the bounds by 50% in each direction.
	// Negative values will retract the bounds.
	pad: function (bufferRatio) {
		var sw = this._southWest,
		    ne = this._northEast,
		    heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio,
		    widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

		return new LatLngBounds(
		        new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
		        new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	},

	// @method getCenter(): LatLng
	// Returns the center point of the bounds.
	getCenter: function () {
		return new LatLng(
		        (this._southWest.lat + this._northEast.lat) / 2,
		        (this._southWest.lng + this._northEast.lng) / 2);
	},

	// @method getSouthWest(): LatLng
	// Returns the south-west point of the bounds.
	getSouthWest: function () {
		return this._southWest;
	},

	// @method getNorthEast(): LatLng
	// Returns the north-east point of the bounds.
	getNorthEast: function () {
		return this._northEast;
	},

	// @method getNorthWest(): LatLng
	// Returns the north-west point of the bounds.
	getNorthWest: function () {
		return new LatLng(this.getNorth(), this.getWest());
	},

	// @method getSouthEast(): LatLng
	// Returns the south-east point of the bounds.
	getSouthEast: function () {
		return new LatLng(this.getSouth(), this.getEast());
	},

	// @method getWest(): Number
	// Returns the west longitude of the bounds
	getWest: function () {
		return this._southWest.lng;
	},

	// @method getSouth(): Number
	// Returns the south latitude of the bounds
	getSouth: function () {
		return this._southWest.lat;
	},

	// @method getEast(): Number
	// Returns the east longitude of the bounds
	getEast: function () {
		return this._northEast.lng;
	},

	// @method getNorth(): Number
	// Returns the north latitude of the bounds
	getNorth: function () {
		return this._northEast.lat;
	},

	// @method contains(otherBounds: LatLngBounds): Boolean
	// Returns `true` if the rectangle contains the given one.

	// @alternative
	// @method contains (latlng: LatLng): Boolean
	// Returns `true` if the rectangle contains the given point.
	contains: function (obj) { // (LatLngBounds) or (LatLng) -> Boolean
		if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
			obj = toLatLng(obj);
		} else {
			obj = toLatLngBounds(obj);
		}

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2, ne2;

		if (obj instanceof LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	},

	// @method intersects(otherBounds: LatLngBounds): Boolean
	// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
	intersects: function (bounds) {
		bounds = toLatLngBounds(bounds);

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2 = bounds.getSouthWest(),
		    ne2 = bounds.getNorthEast(),

		    latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat),
		    lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	},

	// @method overlaps(otherBounds: Bounds): Boolean
	// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
	overlaps: function (bounds) {
		bounds = toLatLngBounds(bounds);

		var sw = this._southWest,
		    ne = this._northEast,
		    sw2 = bounds.getSouthWest(),
		    ne2 = bounds.getNorthEast(),

		    latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat),
		    lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

		return latOverlaps && lngOverlaps;
	},

	// @method toBBoxString(): String
	// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
	toBBoxString: function () {
		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	},

	// @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
	// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
	equals: function (bounds, maxMargin) {
		if (!bounds) { return false; }

		bounds = toLatLngBounds(bounds);

		return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
		       this._northEast.equals(bounds.getNorthEast(), maxMargin);
	},

	// @method isValid(): Boolean
	// Returns `true` if the bounds are properly initialized.
	isValid: function () {
		return !!(this._southWest && this._northEast);
	}
};

// TODO International date line?

// @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
// Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

// @alternative
// @factory L.latLngBounds(latlngs: LatLng[])
// Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
function toLatLngBounds(a, b) {
	if (a instanceof LatLngBounds) {
		return a;
	}
	return new LatLngBounds(a, b);
}

/* @class LatLng
 * @aka L.LatLng
 *
 * Represents a geographical point with a certain latitude and longitude.
 *
 * @example
 *
 * ```
 * var latlng = L.latLng(50.5, 30.5);
 * ```
 *
 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
 *
 * ```
 * map.panTo([50, 30]);
 * map.panTo({lon: 30, lat: 50});
 * map.panTo({lat: 50, lng: 30});
 * map.panTo(L.latLng(50, 30));
 * ```
 *
 * Note that `LatLng` does not inherit from Leafet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

function LatLng(lat, lng, alt) {
	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	}

	// @property lat: Number
	// Latitude in degrees
	this.lat = +lat;

	// @property lng: Number
	// Longitude in degrees
	this.lng = +lng;

	// @property alt: Number
	// Altitude in meters (optional)
	if (alt !== undefined) {
		this.alt = +alt;
	}
}

LatLng.prototype = {
	// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
	// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
	equals: function (obj, maxMargin) {
		if (!obj) { return false; }

		obj = toLatLng(obj);

		var margin = Math.max(
		        Math.abs(this.lat - obj.lat),
		        Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
	},

	// @method toString(): String
	// Returns a string representation of the point (for debugging purposes).
	toString: function (precision) {
		return 'LatLng(' +
		        formatNum(this.lat, precision) + ', ' +
		        formatNum(this.lng, precision) + ')';
	},

	// @method distanceTo(otherLatLng: LatLng): Number
	// Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
	distanceTo: function (other) {
		return Earth.distance(this, toLatLng(other));
	},

	// @method wrap(): LatLng
	// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
	wrap: function () {
		return Earth.wrapLatLng(this);
	},

	// @method toBounds(sizeInMeters: Number): LatLngBounds
	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
	toBounds: function (sizeInMeters) {
		var latAccuracy = 180 * sizeInMeters / 40075017,
		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

		return toLatLngBounds(
		        [this.lat - latAccuracy, this.lng - lngAccuracy],
		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
	},

	clone: function () {
		return new LatLng(this.lat, this.lng, this.alt);
	}
};



// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

// @alternative
// @factory L.latLng(coords: Array): LatLng
// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

// @alternative
// @factory L.latLng(coords: Object): LatLng
// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

function toLatLng(a, b, c) {
	if (a instanceof LatLng) {
		return a;
	}
	if (isArray(a) && typeof a[0] !== 'object') {
		if (a.length === 3) {
			return new LatLng(a[0], a[1], a[2]);
		}
		if (a.length === 2) {
			return new LatLng(a[0], a[1]);
		}
		return null;
	}
	if (a === undefined || a === null) {
		return a;
	}
	if (typeof a === 'object' && 'lat' in a) {
		return new LatLng(a.lat, 'lng' in a ? a.lng : a.lon, a.alt);
	}
	if (b === undefined) {
		return null;
	}
	return new LatLng(a, b, c);
}

/*
 * @namespace CRS
 * @crs L.CRS.Base
 * Object that defines coordinate reference systems for projecting
 * geographical points into pixel (screen) coordinates and back (and to
 * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
 * [spatial reference system](http://en.wikipedia.org/wiki/Coordinate_reference_system).
 *
 * Leaflet defines the most usual CRSs by default. If you want to use a
 * CRS not defined by default, take a look at the
 * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
 *
 * Note that the CRS instances do not inherit from Leafet's `Class` object,
 * and can't be instantiated. Also, new classes can't inherit from them,
 * and methods can't be added to them with the `include` function.
 */

var CRS = {
	// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
	// Projects geographical coordinates into pixel coordinates for a given zoom.
	latLngToPoint: function (latlng, zoom) {
		var projectedPoint = this.projection.project(latlng),
		    scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	},

	// @method pointToLatLng(point: Point, zoom: Number): LatLng
	// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
	// zoom into geographical coordinates.
	pointToLatLng: function (point, zoom) {
		var scale = this.scale(zoom),
		    untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	},

	// @method project(latlng: LatLng): Point
	// Projects geographical coordinates into coordinates in units accepted for
	// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
	project: function (latlng) {
		return this.projection.project(latlng);
	},

	// @method unproject(point: Point): LatLng
	// Given a projected coordinate returns the corresponding LatLng.
	// The inverse of `project`.
	unproject: function (point) {
		return this.projection.unproject(point);
	},

	// @method scale(zoom: Number): Number
	// Returns the scale used when transforming projected coordinates into
	// pixel coordinates for a particular zoom. For example, it returns
	// `256 * 2^zoom` for Mercator-based CRS.
	scale: function (zoom) {
		return 256 * Math.pow(2, zoom);
	},

	// @method zoom(scale: Number): Number
	// Inverse of `scale()`, returns the zoom level corresponding to a scale
	// factor of `scale`.
	zoom: function (scale) {
		return Math.log(scale / 256) / Math.LN2;
	},

	// @method getProjectedBounds(zoom: Number): Bounds
	// Returns the projection's bounds scaled and transformed for the provided `zoom`.
	getProjectedBounds: function (zoom) {
		if (this.infinite) { return null; }

		var b = this.projection.bounds,
		    s = this.scale(zoom),
		    min = this.transformation.transform(b.min, s),
		    max = this.transformation.transform(b.max, s);

		return new Bounds(min, max);
	},

	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
	// Returns the distance between two geographical coordinates.

	// @property code: String
	// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
	//
	// @property wrapLng: Number[]
	// An array of two numbers defining whether the longitude (horizontal) coordinate
	// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
	// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
	//
	// @property wrapLat: Number[]
	// Like `wrapLng`, but for the latitude (vertical) axis.

	// wrapLng: [min, max],
	// wrapLat: [min, max],

	// @property infinite: Boolean
	// If true, the coordinate space will be unbounded (infinite in both axes)
	infinite: false,

	// @method wrapLatLng(latlng: LatLng): LatLng
	// Returns a `LatLng` where lat and lng has been wrapped according to the
	// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
	wrapLatLng: function (latlng) {
		var lng = this.wrapLng ? wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
		    lat = this.wrapLat ? wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
		    alt = latlng.alt;

		return new LatLng(lat, lng, alt);
	},

	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
	// Returns a `LatLngBounds` with the same size as the given one, ensuring
	// that its center is within the CRS's bounds.
	// Only accepts actual `L.LatLngBounds` instances, not arrays.
	wrapLatLngBounds: function (bounds) {
		var center = bounds.getCenter(),
		    newCenter = this.wrapLatLng(center),
		    latShift = center.lat - newCenter.lat,
		    lngShift = center.lng - newCenter.lng;

		if (latShift === 0 && lngShift === 0) {
			return bounds;
		}

		var sw = bounds.getSouthWest(),
		    ne = bounds.getNorthEast(),
		    newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
		    newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

		return new LatLngBounds(newSw, newNe);
	}
};

/*
 * @namespace CRS
 * @crs L.CRS.Earth
 *
 * Serves as the base for CRS that are global such that they cover the earth.
 * Can only be used as the base for other CRS and cannot be used directly,
 * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
 * meters.
 */

var Earth = extend({}, CRS, {
	wrapLng: [-180, 180],

	// Mean Earth Radius, as recommended for use by
	// the International Union of Geodesy and Geophysics,
	// see http://rosettacode.org/wiki/Haversine_formula
	R: 6371000,

	// distance between two geographical points using spherical law of cosines approximation
	distance: function (latlng1, latlng2) {
		var rad = Math.PI / 180,
		    lat1 = latlng1.lat * rad,
		    lat2 = latlng2.lat * rad,
		    sinDLat = Math.sin((latlng2.lat - latlng1.lat) * rad / 2),
		    sinDLon = Math.sin((latlng2.lng - latlng1.lng) * rad / 2),
		    a = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon,
		    c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return this.R * c;
	}
});

/*
 * @namespace Projection
 * @projection L.Projection.SphericalMercator
 *
 * Spherical Mercator projection — the most common projection for online maps,
 * used by almost all free and commercial tile providers. Assumes that Earth is
 * a sphere. Used by the `EPSG:3857` CRS.
 */

var SphericalMercator = {

	R: 6378137,
	MAX_LATITUDE: 85.0511287798,

	project: function (latlng) {
		var d = Math.PI / 180,
		    max = this.MAX_LATITUDE,
		    lat = Math.max(Math.min(max, latlng.lat), -max),
		    sin = Math.sin(lat * d);

		return new Point(
			this.R * latlng.lng * d,
			this.R * Math.log((1 + sin) / (1 - sin)) / 2);
	},

	unproject: function (point) {
		var d = 180 / Math.PI;

		return new LatLng(
			(2 * Math.atan(Math.exp(point.y / this.R)) - (Math.PI / 2)) * d,
			point.x * d / this.R);
	},

	bounds: (function () {
		var d = 6378137 * Math.PI;
		return new Bounds([-d, -d], [d, d]);
	})()
};

/*
 * @class Transformation
 * @aka L.Transformation
 *
 * Represents an affine transformation: a set of coefficients `a`, `b`, `c`, `d`
 * for transforming a point of a form `(x, y)` into `(a*x + b, c*y + d)` and doing
 * the reverse. Used by Leaflet in its projections code.
 *
 * @example
 *
 * ```js
 * var transformation = L.transformation(2, 5, -1, 10),
 * 	p = L.point(1, 2),
 * 	p2 = transformation.transform(p), //  L.point(7, 8)
 * 	p3 = transformation.untransform(p2); //  L.point(1, 2)
 * ```
 */


// factory new L.Transformation(a: Number, b: Number, c: Number, d: Number)
// Creates a `Transformation` object with the given coefficients.
function Transformation(a, b, c, d) {
	if (isArray(a)) {
		// use array properties
		this._a = a[0];
		this._b = a[1];
		this._c = a[2];
		this._d = a[3];
		return;
	}
	this._a = a;
	this._b = b;
	this._c = c;
	this._d = d;
}

Transformation.prototype = {
	// @method transform(point: Point, scale?: Number): Point
	// Returns a transformed point, optionally multiplied by the given scale.
	// Only accepts actual `L.Point` instances, not arrays.
	transform: function (point, scale) { // (Point, Number) -> Point
		return this._transform(point.clone(), scale);
	},

	// destructive transform (faster)
	_transform: function (point, scale) {
		scale = scale || 1;
		point.x = scale * (this._a * point.x + this._b);
		point.y = scale * (this._c * point.y + this._d);
		return point;
	},

	// @method untransform(point: Point, scale?: Number): Point
	// Returns the reverse transformation of the given point, optionally divided
	// by the given scale. Only accepts actual `L.Point` instances, not arrays.
	untransform: function (point, scale) {
		scale = scale || 1;
		return new Point(
		        (point.x / scale - this._b) / this._a,
		        (point.y / scale - this._d) / this._c);
	}
};

// factory L.transformation(a: Number, b: Number, c: Number, d: Number)

// @factory L.transformation(a: Number, b: Number, c: Number, d: Number)
// Instantiates a Transformation object with the given coefficients.

// @alternative
// @factory L.transformation(coefficients: Array): Transformation
// Expects an coefficients array of the form
// `[a: Number, b: Number, c: Number, d: Number]`.

function toTransformation(a, b, c, d) {
	return new Transformation(a, b, c, d);
}

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3857
 *
 * The most common CRS for online maps, used by almost all free and commercial
 * tile providers. Uses Spherical Mercator projection. Set in by default in
 * Map's `crs` option.
 */

var EPSG3857 = extend({}, Earth, {
	code: 'EPSG:3857',
	projection: SphericalMercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * SphericalMercator.R);
		return toTransformation(scale, 0.5, -scale, 0.5);
	}())
});

var EPSG900913 = extend({}, EPSG3857, {
	code: 'EPSG:900913'
});

// @namespace SVG; @section
// There are several static functions which can be called without instantiating L.SVG:

// @function create(name: String): SVGElement
// Returns a instance of [SVGElement](https://developer.mozilla.org/docs/Web/API/SVGElement),
// corresponding to the class name passed. For example, using 'line' will return
// an instance of [SVGLineElement](https://developer.mozilla.org/docs/Web/API/SVGLineElement).
function svgCreate(name) {
	return document.createElementNS('http://www.w3.org/2000/svg', name);
}

// @function pointsToPath(rings: Point[], closed: Boolean): String
// Generates a SVG path string for multiple rings, with each ring turning
// into "M..L..L.." instructions
function pointsToPath(rings, closed) {
	var str = '',
	i, j, len, len2, points, p;

	for (i = 0, len = rings.length; i < len; i++) {
		points = rings[i];

		for (j = 0, len2 = points.length; j < len2; j++) {
			p = points[j];
			str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
		}

		// closes the ring for polygons; "x" is VML syntax
		str += closed ? (svg ? 'z' : 'x') : '';
	}

	// SVG complains about empty path strings
	return str || 'M0 0';
}

/*
 * @namespace Browser
 * @aka L.Browser
 *
 * A namespace with static properties for browser/feature detection used by Leaflet internally.
 *
 * @example
 *
 * ```js
 * if (L.Browser.ielt9) {
 *   alert('Upgrade your browser, dude!');
 * }
 * ```
 */

var style$1 = document.documentElement.style;

// @property ie: Boolean; `true` for all Internet Explorer versions (not Edge).
var ie = 'ActiveXObject' in window;

// @property ielt9: Boolean; `true` for Internet Explorer versions less than 9.
var ielt9 = ie && !document.addEventListener;

// @property edge: Boolean; `true` for the Edge web browser.
var edge = 'msLaunchUri' in navigator && !('documentMode' in document);

// @property webkit: Boolean;
// `true` for webkit-based browsers like Chrome and Safari (including mobile versions).
var webkit = userAgentContains('webkit');

// @property android: Boolean
// `true` for any browser running on an Android platform.
var android = userAgentContains('android');

// @property android23: Boolean; `true` for browsers running on Android 2 or Android 3.
var android23 = userAgentContains('android 2') || userAgentContains('android 3');

/* See https://stackoverflow.com/a/17961266 for details on detecting stock Android */
var webkitVer = parseInt(/WebKit\/([0-9]+)|$/.exec(navigator.userAgent)[1], 10); // also matches AppleWebKit
// @property androidStock: Boolean; `true` for the Android stock browser (i.e. not Chrome)
var androidStock = android && userAgentContains('Google') && webkitVer < 537 && !('AudioNode' in window);

// @property opera: Boolean; `true` for the Opera browser
var opera = !!window.opera;

// @property chrome: Boolean; `true` for the Chrome browser.
var chrome = userAgentContains('chrome');

// @property gecko: Boolean; `true` for gecko-based browsers like Firefox.
var gecko = userAgentContains('gecko') && !webkit && !opera && !ie;

// @property safari: Boolean; `true` for the Safari browser.
var safari = !chrome && userAgentContains('safari');

var phantom = userAgentContains('phantom');

// @property opera12: Boolean
// `true` for the Opera browser supporting CSS transforms (version 12 or later).
var opera12 = 'OTransition' in style$1;

// @property win: Boolean; `true` when the browser is running in a Windows platform
var win = navigator.platform.indexOf('Win') === 0;

// @property ie3d: Boolean; `true` for all Internet Explorer versions supporting CSS transforms.
var ie3d = ie && ('transition' in style$1);

// @property webkit3d: Boolean; `true` for webkit-based browsers supporting CSS transforms.
var webkit3d = ('WebKitCSSMatrix' in window) && ('m11' in new window.WebKitCSSMatrix()) && !android23;

// @property gecko3d: Boolean; `true` for gecko-based browsers supporting CSS transforms.
var gecko3d = 'MozPerspective' in style$1;

// @property any3d: Boolean
// `true` for all browsers supporting CSS transforms.
var any3d = !window.L_DISABLE_3D && (ie3d || webkit3d || gecko3d) && !opera12 && !phantom;

// @property mobile: Boolean; `true` for all browsers running in a mobile device.
var mobile = typeof orientation !== 'undefined' || userAgentContains('mobile');

// @property mobileWebkit: Boolean; `true` for all webkit-based browsers in a mobile device.
var mobileWebkit = mobile && webkit;

// @property mobileWebkit3d: Boolean
// `true` for all webkit-based browsers in a mobile device supporting CSS transforms.
var mobileWebkit3d = mobile && webkit3d;

// @property msPointer: Boolean
// `true` for browsers implementing the Microsoft touch events model (notably IE10).
var msPointer = !window.PointerEvent && window.MSPointerEvent;

// @property pointer: Boolean
// `true` for all browsers supporting [pointer events](https://msdn.microsoft.com/en-us/library/dn433244%28v=vs.85%29.aspx).
var pointer = !!(window.PointerEvent || msPointer);

// @property touch: Boolean
// `true` for all browsers supporting [touch events](https://developer.mozilla.org/docs/Web/API/Touch_events).
// This does not necessarily mean that the browser is running in a computer with
// a touchscreen, it only means that the browser is capable of understanding
// touch events.
var touch = !window.L_NO_TOUCH && (pointer || 'ontouchstart' in window ||
		(window.DocumentTouch && document instanceof window.DocumentTouch));

// @property mobileOpera: Boolean; `true` for the Opera browser in a mobile device.
var mobileOpera = mobile && opera;

// @property mobileGecko: Boolean
// `true` for gecko-based browsers running in a mobile device.
var mobileGecko = mobile && gecko;

// @property retina: Boolean
// `true` for browsers on a high-resolution "retina" screen.
var retina = (window.devicePixelRatio || (window.screen.deviceXDPI / window.screen.logicalXDPI)) > 1;


// @property canvas: Boolean
// `true` when the browser supports [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
var canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

// @property svg: Boolean
// `true` when the browser supports [SVG](https://developer.mozilla.org/docs/Web/SVG).
var svg = !!(document.createElementNS && svgCreate('svg').createSVGRect);

// @property vml: Boolean
// `true` if the browser supports [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language).
var vml = !svg && (function () {
	try {
		var div = document.createElement('div');
		div.innerHTML = '<v:shape adj="1"/>';

		var shape = div.firstChild;
		shape.style.behavior = 'url(#default#VML)';

		return shape && (typeof shape.adj === 'object');

	} catch (e) {
		return false;
	}
}());


function userAgentContains(str) {
	return navigator.userAgent.toLowerCase().indexOf(str) >= 0;
}


var Browser = (Object.freeze || Object)({
	ie: ie,
	ielt9: ielt9,
	edge: edge,
	webkit: webkit,
	android: android,
	android23: android23,
	androidStock: androidStock,
	opera: opera,
	chrome: chrome,
	gecko: gecko,
	safari: safari,
	phantom: phantom,
	opera12: opera12,
	win: win,
	ie3d: ie3d,
	webkit3d: webkit3d,
	gecko3d: gecko3d,
	any3d: any3d,
	mobile: mobile,
	mobileWebkit: mobileWebkit,
	mobileWebkit3d: mobileWebkit3d,
	msPointer: msPointer,
	pointer: pointer,
	touch: touch,
	mobileOpera: mobileOpera,
	mobileGecko: mobileGecko,
	retina: retina,
	canvas: canvas,
	svg: svg,
	vml: vml
});

/*
 * Extends L.DomEvent to provide touch support for Internet Explorer and Windows-based devices.
 */


var POINTER_DOWN =   msPointer ? 'MSPointerDown'   : 'pointerdown';
var POINTER_MOVE =   msPointer ? 'MSPointerMove'   : 'pointermove';
var POINTER_UP =     msPointer ? 'MSPointerUp'     : 'pointerup';
var POINTER_CANCEL = msPointer ? 'MSPointerCancel' : 'pointercancel';
var TAG_WHITE_LIST = ['INPUT', 'SELECT', 'OPTION'];

var _pointers = {};
var _pointerDocListener = false;

// DomEvent.DoubleTap needs to know about this
var _pointersCount = 0;

// Provides a touch events wrapper for (ms)pointer events.
// ref http://www.w3.org/TR/pointerevents/ https://www.w3.org/Bugs/Public/show_bug.cgi?id=22890

function addPointerListener(obj, type, handler, id) {
	if (type === 'touchstart') {
		_addPointerStart(obj, handler, id);

	} else if (type === 'touchmove') {
		_addPointerMove(obj, handler, id);

	} else if (type === 'touchend') {
		_addPointerEnd(obj, handler, id);
	}

	return this;
}

function removePointerListener(obj, type, id) {
	var handler = obj['_leaflet_' + type + id];

	if (type === 'touchstart') {
		obj.removeEventListener(POINTER_DOWN, handler, false);

	} else if (type === 'touchmove') {
		obj.removeEventListener(POINTER_MOVE, handler, false);

	} else if (type === 'touchend') {
		obj.removeEventListener(POINTER_UP, handler, false);
		obj.removeEventListener(POINTER_CANCEL, handler, false);
	}

	return this;
}

function _addPointerStart(obj, handler, id) {
	var onDown = bind(function (e) {
		if (e.pointerType !== 'mouse' && e.MSPOINTER_TYPE_MOUSE && e.pointerType !== e.MSPOINTER_TYPE_MOUSE) {
			// In IE11, some touch events needs to fire for form controls, or
			// the controls will stop working. We keep a whitelist of tag names that
			// need these events. For other target tags, we prevent default on the event.
			if (TAG_WHITE_LIST.indexOf(e.target.tagName) < 0) {
				preventDefault(e);
			} else {
				return;
			}
		}

		_handlePointer(e, handler);
	});

	obj['_leaflet_touchstart' + id] = onDown;
	obj.addEventListener(POINTER_DOWN, onDown, false);

	// need to keep track of what pointers and how many are active to provide e.touches emulation
	if (!_pointerDocListener) {
		// we listen documentElement as any drags that end by moving the touch off the screen get fired there
		document.documentElement.addEventListener(POINTER_DOWN, _globalPointerDown, true);
		document.documentElement.addEventListener(POINTER_MOVE, _globalPointerMove, true);
		document.documentElement.addEventListener(POINTER_UP, _globalPointerUp, true);
		document.documentElement.addEventListener(POINTER_CANCEL, _globalPointerUp, true);

		_pointerDocListener = true;
	}
}

function _globalPointerDown(e) {
	_pointers[e.pointerId] = e;
	_pointersCount++;
}

function _globalPointerMove(e) {
	if (_pointers[e.pointerId]) {
		_pointers[e.pointerId] = e;
	}
}

function _globalPointerUp(e) {
	delete _pointers[e.pointerId];
	_pointersCount--;
}

function _handlePointer(e, handler) {
	e.touches = [];
	for (var i in _pointers) {
		e.touches.push(_pointers[i]);
	}
	e.changedTouches = [e];

	handler(e);
}

function _addPointerMove(obj, handler, id) {
	var onMove = function (e) {
		// don't fire touch moves when mouse isn't down
		if ((e.pointerType === e.MSPOINTER_TYPE_MOUSE || e.pointerType === 'mouse') && e.buttons === 0) { return; }

		_handlePointer(e, handler);
	};

	obj['_leaflet_touchmove' + id] = onMove;
	obj.addEventListener(POINTER_MOVE, onMove, false);
}

function _addPointerEnd(obj, handler, id) {
	var onUp = function (e) {
		_handlePointer(e, handler);
	};

	obj['_leaflet_touchend' + id] = onUp;
	obj.addEventListener(POINTER_UP, onUp, false);
	obj.addEventListener(POINTER_CANCEL, onUp, false);
}

/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

var _touchstart = msPointer ? 'MSPointerDown' : pointer ? 'pointerdown' : 'touchstart';
var _touchend = msPointer ? 'MSPointerUp' : pointer ? 'pointerup' : 'touchend';
var _pre = '_leaflet_';

// inspired by Zepto touch code by Thomas Fuchs
function addDoubleTapListener(obj, handler, id) {
	var last, touch$$1,
	    doubleTap = false,
	    delay = 250;

	function onTouchStart(e) {
		var count;

		if (pointer) {
			if ((!edge) || e.pointerType === 'mouse') { return; }
			count = _pointersCount;
		} else {
			count = e.touches.length;
		}

		if (count > 1) { return; }

		var now = Date.now(),
		    delta = now - (last || now);

		touch$$1 = e.touches ? e.touches[0] : e;
		doubleTap = (delta > 0 && delta <= delay);
		last = now;
	}

	function onTouchEnd(e) {
		if (doubleTap && !touch$$1.cancelBubble) {
			if (pointer) {
				if ((!edge) || e.pointerType === 'mouse') { return; }
				// work around .type being readonly with MSPointer* events
				var newTouch = {},
				    prop, i;

				for (i in touch$$1) {
					prop = touch$$1[i];
					newTouch[i] = prop && prop.bind ? prop.bind(touch$$1) : prop;
				}
				touch$$1 = newTouch;
			}
			touch$$1.type = 'dblclick';
			handler(touch$$1);
			last = null;
		}
	}

	obj[_pre + _touchstart + id] = onTouchStart;
	obj[_pre + _touchend + id] = onTouchEnd;
	obj[_pre + 'dblclick' + id] = handler;

	obj.addEventListener(_touchstart, onTouchStart, false);
	obj.addEventListener(_touchend, onTouchEnd, false);

	// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
	// the browser doesn't fire touchend/pointerup events but does fire
	// native dblclicks. See #4127.
	// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
	obj.addEventListener('dblclick', handler, false);

	return this;
}

function removeDoubleTapListener(obj, id) {
	var touchstart = obj[_pre + _touchstart + id],
	    touchend = obj[_pre + _touchend + id],
	    dblclick = obj[_pre + 'dblclick' + id];

	obj.removeEventListener(_touchstart, touchstart, false);
	obj.removeEventListener(_touchend, touchend, false);
	if (!edge) {
		obj.removeEventListener('dblclick', dblclick, false);
	}

	return this;
}

/*
 * @namespace DomEvent
 * Utility functions to work with the [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
 */

// Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

// @function on(el: HTMLElement, types: String, fn: Function, context?: Object): this
// Adds a listener function (`fn`) to a particular DOM event type of the
// element `el`. You can optionally specify the context of the listener
// (object the `this` keyword will point to). You can also pass several
// space-separated types (e.g. `'click dblclick'`).

// @alternative
// @function on(el: HTMLElement, eventMap: Object, context?: Object): this
// Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
function on(obj, types, fn, context) {

	if (typeof types === 'object') {
		for (var type in types) {
			addOne(obj, type, types[type], fn);
		}
	} else {
		types = splitWords(types);

		for (var i = 0, len = types.length; i < len; i++) {
			addOne(obj, types[i], fn, context);
		}
	}

	return this;
}

var eventsKey = '_leaflet_events';

// @function off(el: HTMLElement, types: String, fn: Function, context?: Object): this
// Removes a previously added listener function.
// Note that if you passed a custom context to on, you must pass the same
// context to `off` in order to remove the listener.

// @alternative
// @function off(el: HTMLElement, eventMap: Object, context?: Object): this
// Removes a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
function off(obj, types, fn, context) {

	if (typeof types === 'object') {
		for (var type in types) {
			removeOne(obj, type, types[type], fn);
		}
	} else if (types) {
		types = splitWords(types);

		for (var i = 0, len = types.length; i < len; i++) {
			removeOne(obj, types[i], fn, context);
		}
	} else {
		for (var j in obj[eventsKey]) {
			removeOne(obj, j, obj[eventsKey][j]);
		}
		delete obj[eventsKey];
	}

	return this;
}

function addOne(obj, type, fn, context) {
	var id = type + stamp(fn) + (context ? '_' + stamp(context) : '');

	if (obj[eventsKey] && obj[eventsKey][id]) { return this; }

	var handler = function (e) {
		return fn.call(context || obj, e || window.event);
	};

	var originalHandler = handler;

	if (pointer && type.indexOf('touch') === 0) {
		// Needs DomEvent.Pointer.js
		addPointerListener(obj, type, handler, id);

	} else if (touch && (type === 'dblclick') && addDoubleTapListener &&
	           !(pointer && chrome)) {
		// Chrome >55 does not need the synthetic dblclicks from addDoubleTapListener
		// See #5180
		addDoubleTapListener(obj, handler, id);

	} else if ('addEventListener' in obj) {

		if (type === 'mousewheel') {
			obj.addEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

		} else if ((type === 'mouseenter') || (type === 'mouseleave')) {
			handler = function (e) {
				e = e || window.event;
				if (isExternalTarget(obj, e)) {
					originalHandler(e);
				}
			};
			obj.addEventListener(type === 'mouseenter' ? 'mouseover' : 'mouseout', handler, false);

		} else {
			if (type === 'click' && android) {
				handler = function (e) {
					filterClick(e, originalHandler);
				};
			}
			obj.addEventListener(type, handler, false);
		}

	} else if ('attachEvent' in obj) {
		obj.attachEvent('on' + type, handler);
	}

	obj[eventsKey] = obj[eventsKey] || {};
	obj[eventsKey][id] = handler;
}

function removeOne(obj, type, fn, context) {

	var id = type + stamp(fn) + (context ? '_' + stamp(context) : ''),
	    handler = obj[eventsKey] && obj[eventsKey][id];

	if (!handler) { return this; }

	if (pointer && type.indexOf('touch') === 0) {
		removePointerListener(obj, type, id);

	} else if (touch && (type === 'dblclick') && removeDoubleTapListener &&
	           !(pointer && chrome)) {
		removeDoubleTapListener(obj, id);

	} else if ('removeEventListener' in obj) {

		if (type === 'mousewheel') {
			obj.removeEventListener('onwheel' in obj ? 'wheel' : 'mousewheel', handler, false);

		} else {
			obj.removeEventListener(
				type === 'mouseenter' ? 'mouseover' :
				type === 'mouseleave' ? 'mouseout' : type, handler, false);
		}

	} else if ('detachEvent' in obj) {
		obj.detachEvent('on' + type, handler);
	}

	obj[eventsKey][id] = null;
}

// @function stopPropagation(ev: DOMEvent): this
// Stop the given event from propagation to parent elements. Used inside the listener functions:
// ```js
// L.DomEvent.on(div, 'click', function (ev) {
// 	L.DomEvent.stopPropagation(ev);
// });
// ```
function stopPropagation(e) {

	if (e.stopPropagation) {
		e.stopPropagation();
	} else if (e.originalEvent) {  // In case of Leaflet event.
		e.originalEvent._stopped = true;
	} else {
		e.cancelBubble = true;
	}
	skipped(e);

	return this;
}

// @function disableScrollPropagation(el: HTMLElement): this
// Adds `stopPropagation` to the element's `'mousewheel'` events (plus browser variants).
function disableScrollPropagation(el) {
	addOne(el, 'mousewheel', stopPropagation);
	return this;
}

// @function disableClickPropagation(el: HTMLElement): this
// Adds `stopPropagation` to the element's `'click'`, `'doubleclick'`,
// `'mousedown'` and `'touchstart'` events (plus browser variants).
function disableClickPropagation(el) {
	on(el, 'mousedown touchstart dblclick', stopPropagation);
	addOne(el, 'click', fakeStop);
	return this;
}

// @function preventDefault(ev: DOMEvent): this
// Prevents the default action of the DOM Event `ev` from happening (such as
// following a link in the href of the a element, or doing a POST request
// with page reload when a `<form>` is submitted).
// Use it inside listener functions.
function preventDefault(e) {
	if (e.preventDefault) {
		e.preventDefault();
	} else {
		e.returnValue = false;
	}
	return this;
}

// @function stop(ev: DOMEvent): this
// Does `stopPropagation` and `preventDefault` at the same time.
function stop(e) {
	preventDefault(e);
	stopPropagation(e);
	return this;
}

// @function getMousePosition(ev: DOMEvent, container?: HTMLElement): Point
// Gets normalized mouse position from a DOM event relative to the
// `container` or to the whole page if not specified.
function getMousePosition(e, container) {
	if (!container) {
		return new Point(e.clientX, e.clientY);
	}

	var rect = container.getBoundingClientRect();

	var scaleX = rect.width / container.offsetWidth || 1;
	var scaleY = rect.height / container.offsetHeight || 1;
	return new Point(
		e.clientX / scaleX - rect.left - container.clientLeft,
		e.clientY / scaleY - rect.top - container.clientTop);
}

// Chrome on Win scrolls double the pixels as in other platforms (see #4538),
// and Firefox scrolls device pixels, not CSS pixels
var wheelPxFactor =
	(win && chrome) ? 2 * window.devicePixelRatio :
	gecko ? window.devicePixelRatio : 1;

// @function getWheelDelta(ev: DOMEvent): Number
// Gets normalized wheel delta from a mousewheel DOM event, in vertical
// pixels scrolled (negative if scrolling down).
// Events from pointing devices without precise scrolling are mapped to
// a best guess of 60 pixels.
function getWheelDelta(e) {
	return (edge) ? e.wheelDeltaY / 2 : // Don't trust window-geometry-based delta
	       (e.deltaY && e.deltaMode === 0) ? -e.deltaY / wheelPxFactor : // Pixels
	       (e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
	       (e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
	       (e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
	       e.wheelDelta ? (e.wheelDeltaY || e.wheelDelta) / 2 : // Legacy IE pixels
	       (e.detail && Math.abs(e.detail) < 32765) ? -e.detail * 20 : // Legacy Moz lines
	       e.detail ? e.detail / -32765 * 60 : // Legacy Moz pages
	       0;
}

var skipEvents = {};

function fakeStop(e) {
	// fakes stopPropagation by setting a special event flag, checked/reset with skipped(e)
	skipEvents[e.type] = true;
}

function skipped(e) {
	var events = skipEvents[e.type];
	// reset when checking, as it's only used in map container and propagates outside of the map
	skipEvents[e.type] = false;
	return events;
}

// check if element really left/entered the event target (for mouseenter/mouseleave)
function isExternalTarget(el, e) {

	var related = e.relatedTarget;

	if (!related) { return true; }

	try {
		while (related && (related !== el)) {
			related = related.parentNode;
		}
	} catch (err) {
		return false;
	}
	return (related !== el);
}

var lastClick;

// this is a horrible workaround for a bug in Android where a single touch triggers two click events
function filterClick(e, handler) {
	var timeStamp = (e.timeStamp || (e.originalEvent && e.originalEvent.timeStamp)),
	    elapsed = lastClick && (timeStamp - lastClick);

	// are they closer together than 500ms yet more than 100ms?
	// Android typically triggers them ~300ms apart while multiple listeners
	// on the same event should be triggered far faster;
	// or check if click is simulated on the element, and if it is, reject any non-simulated events

	if ((elapsed && elapsed > 100 && elapsed < 500) || (e.target._simulatedClick && !e._simulated)) {
		stop(e);
		return;
	}
	lastClick = timeStamp;

	handler(e);
}




var DomEvent = (Object.freeze || Object)({
	on: on,
	off: off,
	stopPropagation: stopPropagation,
	disableScrollPropagation: disableScrollPropagation,
	disableClickPropagation: disableClickPropagation,
	preventDefault: preventDefault,
	stop: stop,
	getMousePosition: getMousePosition,
	getWheelDelta: getWheelDelta,
	fakeStop: fakeStop,
	skipped: skipped,
	isExternalTarget: isExternalTarget,
	addListener: on,
	removeListener: off
});

/*
 * @namespace DomUtil
 *
 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
 * tree, used by Leaflet internally.
 *
 * Most functions expecting or returning a `HTMLElement` also work for
 * SVG elements. The only difference is that classes refer to CSS classes
 * in HTML and SVG classes in SVG.
 */


// @property TRANSFORM: String
// Vendor-prefixed transform style name (e.g. `'webkitTransform'` for WebKit).
var TRANSFORM = testProp(
	['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform']);

// webkitTransition comes first because some browser versions that drop vendor prefix don't do
// the same for the transitionend event, in particular the Android 4.1 stock browser

// @property TRANSITION: String
// Vendor-prefixed transition style name.
var TRANSITION = testProp(
	['webkitTransition', 'transition', 'OTransition', 'MozTransition', 'msTransition']);

// @property TRANSITION_END: String
// Vendor-prefixed transitionend event name.
var TRANSITION_END =
	TRANSITION === 'webkitTransition' || TRANSITION === 'OTransition' ? TRANSITION + 'End' : 'transitionend';


// @function get(id: String|HTMLElement): HTMLElement
// Returns an element given its DOM id, or returns the element itself
// if it was passed directly.
function get(id) {
	return typeof id === 'string' ? document.getElementById(id) : id;
}

// @function getStyle(el: HTMLElement, styleAttrib: String): String
// Returns the value for a certain style attribute on an element,
// including computed values or values set through CSS.
function getStyle(el, style) {
	var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

	if ((!value || value === 'auto') && document.defaultView) {
		var css = document.defaultView.getComputedStyle(el, null);
		value = css ? css[style] : null;
	}
	return value === 'auto' ? null : value;
}

// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
// Creates an HTML element with `tagName`, sets its class to `className`, and optionally appends it to `container` element.
function create$1(tagName, className, container) {
	var el = document.createElement(tagName);
	el.className = className || '';

	if (container) {
		container.appendChild(el);
	}
	return el;
}

// @function remove(el: HTMLElement)
// Removes `el` from its parent element
function remove(el) {
	var parent = el.parentNode;
	if (parent) {
		parent.removeChild(el);
	}
}

// @function empty(el: HTMLElement)
// Removes all of `el`'s children elements from `el`
function empty(el) {
	while (el.firstChild) {
		el.removeChild(el.firstChild);
	}
}

// @function toFront(el: HTMLElement)
// Makes `el` the last child of its parent, so it renders in front of the other children.
function toFront(el) {
	var parent = el.parentNode;
	if (parent.lastChild !== el) {
		parent.appendChild(el);
	}
}

// @function toBack(el: HTMLElement)
// Makes `el` the first child of its parent, so it renders behind the other children.
function toBack(el) {
	var parent = el.parentNode;
	if (parent.firstChild !== el) {
		parent.insertBefore(el, parent.firstChild);
	}
}

// @function hasClass(el: HTMLElement, name: String): Boolean
// Returns `true` if the element's class attribute contains `name`.
function hasClass(el, name) {
	if (el.classList !== undefined) {
		return el.classList.contains(name);
	}
	var className = getClass(el);
	return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
}

// @function addClass(el: HTMLElement, name: String)
// Adds `name` to the element's class attribute.
function addClass(el, name) {
	if (el.classList !== undefined) {
		var classes = splitWords(name);
		for (var i = 0, len = classes.length; i < len; i++) {
			el.classList.add(classes[i]);
		}
	} else if (!hasClass(el, name)) {
		var className = getClass(el);
		setClass(el, (className ? className + ' ' : '') + name);
	}
}

// @function removeClass(el: HTMLElement, name: String)
// Removes `name` from the element's class attribute.
function removeClass(el, name) {
	if (el.classList !== undefined) {
		el.classList.remove(name);
	} else {
		setClass(el, trim((' ' + getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
	}
}

// @function setClass(el: HTMLElement, name: String)
// Sets the element's class.
function setClass(el, name) {
	if (el.className.baseVal === undefined) {
		el.className = name;
	} else {
		// in case of SVG element
		el.className.baseVal = name;
	}
}

// @function getClass(el: HTMLElement): String
// Returns the element's class.
function getClass(el) {
	return el.className.baseVal === undefined ? el.className : el.className.baseVal;
}

// @function setOpacity(el: HTMLElement, opacity: Number)
// Set the opacity of an element (including old IE support).
// `opacity` must be a number from `0` to `1`.
function setOpacity(el, value) {
	if ('opacity' in el.style) {
		el.style.opacity = value;
	} else if ('filter' in el.style) {
		_setOpacityIE(el, value);
	}
}

function _setOpacityIE(el, value) {
	var filter = false,
	    filterName = 'DXImageTransform.Microsoft.Alpha';

	// filters collection throws an error if we try to retrieve a filter that doesn't exist
	try {
		filter = el.filters.item(filterName);
	} catch (e) {
		// don't set opacity to 1 if we haven't already set an opacity,
		// it isn't needed and breaks transparent pngs.
		if (value === 1) { return; }
	}

	value = Math.round(value * 100);

	if (filter) {
		filter.Enabled = (value !== 100);
		filter.Opacity = value;
	} else {
		el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
	}
}

// @function testProp(props: String[]): String|false
// Goes through the array of style names and returns the first name
// that is a valid style name for an element. If no such name is found,
// it returns false. Useful for vendor-prefixed styles like `transform`.
function testProp(props) {
	var style = document.documentElement.style;

	for (var i = 0; i < props.length; i++) {
		if (props[i] in style) {
			return props[i];
		}
	}
	return false;
}

// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
// Resets the 3D CSS transform of `el` so it is translated by `offset` pixels
// and optionally scaled by `scale`. Does not have an effect if the
// browser doesn't support 3D CSS transforms.
function setTransform(el, offset, scale) {
	var pos = offset || new Point(0, 0);

	el.style[TRANSFORM] =
		(ie3d ?
			'translate(' + pos.x + 'px,' + pos.y + 'px)' :
			'translate3d(' + pos.x + 'px,' + pos.y + 'px,0)') +
		(scale ? ' scale(' + scale + ')' : '');
}

// @function setPosition(el: HTMLElement, position: Point)
// Sets the position of `el` to coordinates specified by `position`,
// using CSS translate or top/left positioning depending on the browser
// (used by Leaflet internally to position its layers).
function setPosition(el, point) {

	/*eslint-disable */
	el._leaflet_pos = point;
	/* eslint-enable */

	if (any3d) {
		setTransform(el, point);
	} else {
		el.style.left = point.x + 'px';
		el.style.top = point.y + 'px';
	}
}

// @function getPosition(el: HTMLElement): Point
// Returns the coordinates of an element previously positioned with setPosition.
function getPosition(el) {
	// this method is only used for elements previously positioned using setPosition,
	// so it's safe to cache the position for performance

	return el._leaflet_pos || new Point(0, 0);
}

// @function disableTextSelection()
// Prevents the user from generating `selectstart` DOM events, usually generated
// when the user drags the mouse through a page with text. Used internally
// by Leaflet to override the behaviour of any click-and-drag interaction on
// the map. Affects drag interactions on the whole document.

// @function enableTextSelection()
// Cancels the effects of a previous [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection).
var disableTextSelection;
var enableTextSelection;
var _userSelect;
if ('onselectstart' in document) {
	disableTextSelection = function () {
		on(window, 'selectstart', preventDefault);
	};
	enableTextSelection = function () {
		off(window, 'selectstart', preventDefault);
	};
} else {
	var userSelectProperty = testProp(
		['userSelect', 'WebkitUserSelect', 'OUserSelect', 'MozUserSelect', 'msUserSelect']);

	disableTextSelection = function () {
		if (userSelectProperty) {
			var style = document.documentElement.style;
			_userSelect = style[userSelectProperty];
			style[userSelectProperty] = 'none';
		}
	};
	enableTextSelection = function () {
		if (userSelectProperty) {
			document.documentElement.style[userSelectProperty] = _userSelect;
			_userSelect = undefined;
		}
	};
}

// @function disableImageDrag()
// As [`L.DomUtil.disableTextSelection`](#domutil-disabletextselection), but
// for `dragstart` DOM events, usually generated when the user drags an image.
function disableImageDrag() {
	on(window, 'dragstart', preventDefault);
}

// @function enableImageDrag()
// Cancels the effects of a previous [`L.DomUtil.disableImageDrag`](#domutil-disabletextselection).
function enableImageDrag() {
	off(window, 'dragstart', preventDefault);
}

var _outlineElement;
var _outlineStyle;
// @function preventOutline(el: HTMLElement)
// Makes the [outline](https://developer.mozilla.org/docs/Web/CSS/outline)
// of the element `el` invisible. Used internally by Leaflet to prevent
// focusable elements from displaying an outline when the user performs a
// drag interaction on them.
function preventOutline(element) {
	while (element.tabIndex === -1) {
		element = element.parentNode;
	}
	if (!element.style) { return; }
	restoreOutline();
	_outlineElement = element;
	_outlineStyle = element.style.outline;
	element.style.outline = 'none';
	on(window, 'keydown', restoreOutline);
}

// @function restoreOutline()
// Cancels the effects of a previous [`L.DomUtil.preventOutline`]().
function restoreOutline() {
	if (!_outlineElement) { return; }
	_outlineElement.style.outline = _outlineStyle;
	_outlineElement = undefined;
	_outlineStyle = undefined;
	off(window, 'keydown', restoreOutline);
}


var DomUtil = (Object.freeze || Object)({
	TRANSFORM: TRANSFORM,
	TRANSITION: TRANSITION,
	TRANSITION_END: TRANSITION_END,
	get: get,
	getStyle: getStyle,
	create: create$1,
	remove: remove,
	empty: empty,
	toFront: toFront,
	toBack: toBack,
	hasClass: hasClass,
	addClass: addClass,
	removeClass: removeClass,
	setClass: setClass,
	getClass: getClass,
	setOpacity: setOpacity,
	testProp: testProp,
	setTransform: setTransform,
	setPosition: setPosition,
	getPosition: getPosition,
	disableTextSelection: disableTextSelection,
	enableTextSelection: enableTextSelection,
	disableImageDrag: disableImageDrag,
	enableImageDrag: enableImageDrag,
	preventOutline: preventOutline,
	restoreOutline: restoreOutline
});

/*
 * @class PosAnimation
 * @aka L.PosAnimation
 * @inherits Evented
 * Used internally for panning animations, utilizing CSS3 Transitions for modern browsers and a timer fallback for IE6-9.
 *
 * @example
 * ```js
 * var fx = new L.PosAnimation();
 * fx.run(el, [300, 500], 0.5);
 * ```
 *
 * @constructor L.PosAnimation()
 * Creates a `PosAnimation` object.
 *
 */

var PosAnimation = Evented.extend({

	// @method run(el: HTMLElement, newPos: Point, duration?: Number, easeLinearity?: Number)
	// Run an animation of a given element to a new position, optionally setting
	// duration in seconds (`0.25` by default) and easing linearity factor (3rd
	// argument of the [cubic bezier curve](http://cubic-bezier.com/#0,0,.5,1),
	// `0.5` by default).
	run: function (el, newPos, duration, easeLinearity) {
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._duration = duration || 0.25;
		this._easeOutPower = 1 / Math.max(easeLinearity || 0.5, 0.2);

		this._startPos = getPosition(el);
		this._offset = newPos.subtract(this._startPos);
		this._startTime = +new Date();

		// @event start: Event
		// Fired when the animation starts
		this.fire('start');

		this._animate();
	},

	// @method stop()
	// Stops the animation (if currently running).
	stop: function () {
		if (!this._inProgress) { return; }

		this._step(true);
		this._complete();
	},

	_animate: function () {
		// animation loop
		this._animId = requestAnimFrame(this._animate, this);
		this._step();
	},

	_step: function (round) {
		var elapsed = (+new Date()) - this._startTime,
		    duration = this._duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._easeOut(elapsed / duration), round);
		} else {
			this._runFrame(1);
			this._complete();
		}
	},

	_runFrame: function (progress, round) {
		var pos = this._startPos.add(this._offset.multiplyBy(progress));
		if (round) {
			pos._round();
		}
		setPosition(this._el, pos);

		// @event step: Event
		// Fired continuously during the animation.
		this.fire('step');
	},

	_complete: function () {
		cancelAnimFrame(this._animId);

		this._inProgress = false;
		// @event end: Event
		// Fired when the animation ends.
		this.fire('end');
	},

	_easeOut: function (t) {
		return 1 - Math.pow(1 - t, this._easeOutPower);
	}
});

/*
 * @class Map
 * @aka L.Map
 * @inherits Evented
 *
 * The central class of the API — it is used to create a map on a page and manipulate it.
 *
 * @example
 *
 * ```js
 * // initialize the map on the "map" div with a given center and zoom
 * var map = L.map('map', {
 * 	center: [51.505, -0.09],
 * 	zoom: 13
 * });
 * ```
 *
 */

var Map = Evented.extend({

	options: {
		// @section Map State Options
		// @option crs: CRS = L.CRS.EPSG3857
		// The [Coordinate Reference System](#crs) to use. Don't change this if you're not
		// sure what it means.
		crs: EPSG3857,

		// @option center: LatLng = undefined
		// Initial geographic center of the map
		center: undefined,

		// @option zoom: Number = undefined
		// Initial map zoom level
		zoom: undefined,

		// @option minZoom: Number = *
		// Minimum zoom level of the map.
		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
		// the lowest of their `minZoom` options will be used instead.
		minZoom: undefined,

		// @option maxZoom: Number = *
		// Maximum zoom level of the map.
		// If not specified and at least one `GridLayer` or `TileLayer` is in the map,
		// the highest of their `maxZoom` options will be used instead.
		maxZoom: undefined,

		// @option layers: Layer[] = []
		// Array of layers that will be added to the map initially
		layers: [],

		// @option maxBounds: LatLngBounds = null
		// When this option is set, the map restricts the view to the given
		// geographical bounds, bouncing the user back if the user tries to pan
		// outside the view. To set the restriction dynamically, use
		// [`setMaxBounds`](#map-setmaxbounds) method.
		maxBounds: undefined,

		// @option renderer: Renderer = *
		// The default method for drawing vector layers on the map. `L.SVG`
		// or `L.Canvas` by default depending on browser support.
		renderer: undefined,


		// @section Animation Options
		// @option zoomAnimation: Boolean = true
		// Whether the map zoom animation is enabled. By default it's enabled
		// in all browsers that support CSS3 Transitions except Android.
		zoomAnimation: true,

		// @option zoomAnimationThreshold: Number = 4
		// Won't animate zoom if the zoom difference exceeds this value.
		zoomAnimationThreshold: 4,

		// @option fadeAnimation: Boolean = true
		// Whether the tile fade animation is enabled. By default it's enabled
		// in all browsers that support CSS3 Transitions except Android.
		fadeAnimation: true,

		// @option markerZoomAnimation: Boolean = true
		// Whether markers animate their zoom with the zoom animation, if disabled
		// they will disappear for the length of the animation. By default it's
		// enabled in all browsers that support CSS3 Transitions except Android.
		markerZoomAnimation: true,

		// @option transform3DLimit: Number = 2^23
		// Defines the maximum size of a CSS translation transform. The default
		// value should not be changed unless a web browser positions layers in
		// the wrong place after doing a large `panBy`.
		transform3DLimit: 8388608, // Precision limit of a 32-bit float

		// @section Interaction Options
		// @option zoomSnap: Number = 1
		// Forces the map's zoom level to always be a multiple of this, particularly
		// right after a [`fitBounds()`](#map-fitbounds) or a pinch-zoom.
		// By default, the zoom level snaps to the nearest integer; lower values
		// (e.g. `0.5` or `0.1`) allow for greater granularity. A value of `0`
		// means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
		zoomSnap: 1,

		// @option zoomDelta: Number = 1
		// Controls how much the map's zoom level will change after a
		// [`zoomIn()`](#map-zoomin), [`zoomOut()`](#map-zoomout), pressing `+`
		// or `-` on the keyboard, or using the [zoom controls](#control-zoom).
		// Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
		zoomDelta: 1,

		// @option trackResize: Boolean = true
		// Whether the map automatically handles browser window resize to update itself.
		trackResize: true
	},

	initialize: function (id, options) { // (HTMLElement or String, Object)
		options = setOptions(this, options);

		this._initContainer(id);
		this._initLayout();

		// hack for https://github.com/Leaflet/Leaflet/issues/1980
		this._onResize = bind(this._onResize, this);

		this._initEvents();

		if (options.maxBounds) {
			this.setMaxBounds(options.maxBounds);
		}

		if (options.zoom !== undefined) {
			this._zoom = this._limitZoom(options.zoom);
		}

		if (options.center && options.zoom !== undefined) {
			this.setView(toLatLng(options.center), options.zoom, {reset: true});
		}

		this._handlers = [];
		this._layers = {};
		this._zoomBoundLayers = {};
		this._sizeChanged = true;

		this.callInitHooks();

		// don't animate on browsers without hardware-accelerated transitions or old Android/Opera
		this._zoomAnimated = TRANSITION && any3d && !mobileOpera &&
				this.options.zoomAnimation;

		// zoom transitions run with the same duration for all layers, so if one of transitionend events
		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
		if (this._zoomAnimated) {
			this._createAnimProxy();
			on(this._proxy, TRANSITION_END, this._catchTransitionEnd, this);
		}

		this._addLayers(this.options.layers);
	},


	// @section Methods for modifying map state

	// @method setView(center: LatLng, zoom: Number, options?: Zoom/pan options): this
	// Sets the view of the map (geographical center and zoom) with the given
	// animation options.
	setView: function (center, zoom, options) {

		zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
		center = this._limitCenter(toLatLng(center), zoom, this.options.maxBounds);
		options = options || {};

		this._stop();

		if (this._loaded && !options.reset && options !== true) {

			if (options.animate !== undefined) {
				options.zoom = extend({animate: options.animate}, options.zoom);
				options.pan = extend({animate: options.animate, duration: options.duration}, options.pan);
			}

			// try animating pan or zoom
			var moved = (this._zoom !== zoom) ?
				this._tryAnimatedZoom && this._tryAnimatedZoom(center, zoom, options.zoom) :
				this._tryAnimatedPan(center, options.pan);

			if (moved) {
				// prevent resize handler call, the view will refresh after animation anyway
				clearTimeout(this._sizeTimer);
				return this;
			}
		}

		// animation didn't start, just reset the map view
		this._resetView(center, zoom);

		return this;
	},

	// @method setZoom(zoom: Number, options?: Zoom/pan options): this
	// Sets the zoom of the map.
	setZoom: function (zoom, options) {
		if (!this._loaded) {
			this._zoom = zoom;
			return this;
		}
		return this.setView(this.getCenter(), zoom, {zoom: options});
	},

	// @method zoomIn(delta?: Number, options?: Zoom options): this
	// Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	zoomIn: function (delta, options) {
		delta = delta || (any3d ? this.options.zoomDelta : 1);
		return this.setZoom(this._zoom + delta, options);
	},

	// @method zoomOut(delta?: Number, options?: Zoom options): this
	// Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	zoomOut: function (delta, options) {
		delta = delta || (any3d ? this.options.zoomDelta : 1);
		return this.setZoom(this._zoom - delta, options);
	},

	// @method setZoomAround(latlng: LatLng, zoom: Number, options: Zoom options): this
	// Zooms the map while keeping a specified geographical point on the map
	// stationary (e.g. used internally for scroll zoom and double-click zoom).
	// @alternative
	// @method setZoomAround(offset: Point, zoom: Number, options: Zoom options): this
	// Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
	setZoomAround: function (latlng, zoom, options) {
		var scale = this.getZoomScale(zoom),
		    viewHalf = this.getSize().divideBy(2),
		    containerPoint = latlng instanceof Point ? latlng : this.latLngToContainerPoint(latlng),

		    centerOffset = containerPoint.subtract(viewHalf).multiplyBy(1 - 1 / scale),
		    newCenter = this.containerPointToLatLng(viewHalf.add(centerOffset));

		return this.setView(newCenter, zoom, {zoom: options});
	},

	_getBoundsCenterZoom: function (bounds, options) {

		options = options || {};
		bounds = bounds.getBounds ? bounds.getBounds() : toLatLngBounds(bounds);

		var paddingTL = toPoint(options.paddingTopLeft || options.padding || [0, 0]),
		    paddingBR = toPoint(options.paddingBottomRight || options.padding || [0, 0]),

		    zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

		zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

		if (zoom === Infinity) {
			return {
				center: bounds.getCenter(),
				zoom: zoom
			};
		}

		var paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

		    swPoint = this.project(bounds.getSouthWest(), zoom),
		    nePoint = this.project(bounds.getNorthEast(), zoom),
		    center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

		return {
			center: center,
			zoom: zoom
		};
	},

	// @method fitBounds(bounds: LatLngBounds, options?: fitBounds options): this
	// Sets a map view that contains the given geographical bounds with the
	// maximum zoom level possible.
	fitBounds: function (bounds, options) {

		bounds = toLatLngBounds(bounds);

		if (!bounds.isValid()) {
			throw new Error('Bounds are not valid.');
		}

		var target = this._getBoundsCenterZoom(bounds, options);
		return this.setView(target.center, target.zoom, options);
	},

	// @method fitWorld(options?: fitBounds options): this
	// Sets a map view that mostly contains the whole world with the maximum
	// zoom level possible.
	fitWorld: function (options) {
		return this.fitBounds([[-90, -180], [90, 180]], options);
	},

	// @method panTo(latlng: LatLng, options?: Pan options): this
	// Pans the map to a given center.
	panTo: function (center, options) { // (LatLng)
		return this.setView(center, this._zoom, {pan: options});
	},

	// @method panBy(offset: Point, options?: Pan options): this
	// Pans the map by a given number of pixels (animated).
	panBy: function (offset, options) {
		offset = toPoint(offset).round();
		options = options || {};

		if (!offset.x && !offset.y) {
			return this.fire('moveend');
		}
		// If we pan too far, Chrome gets issues with tiles
		// and makes them disappear or appear in the wrong place (slightly offset) #2602
		if (options.animate !== true && !this.getSize().contains(offset)) {
			this._resetView(this.unproject(this.project(this.getCenter()).add(offset)), this.getZoom());
			return this;
		}

		if (!this._panAnim) {
			this._panAnim = new PosAnimation();

			this._panAnim.on({
				'step': this._onPanTransitionStep,
				'end': this._onPanTransitionEnd
			}, this);
		}

		// don't fire movestart if animating inertia
		if (!options.noMoveStart) {
			this.fire('movestart');
		}

		// animate pan unless animate: false specified
		if (options.animate !== false) {
			addClass(this._mapPane, 'leaflet-pan-anim');

			var newPos = this._getMapPanePos().subtract(offset).round();
			this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
		} else {
			this._rawPanBy(offset);
			this.fire('move').fire('moveend');
		}

		return this;
	},

	// @method flyTo(latlng: LatLng, zoom?: Number, options?: Zoom/pan options): this
	// Sets the view of the map (geographical center and zoom) performing a smooth
	// pan-zoom animation.
	flyTo: function (targetCenter, targetZoom, options) {

		options = options || {};
		if (options.animate === false || !any3d) {
			return this.setView(targetCenter, targetZoom, options);
		}

		this._stop();

		var from = this.project(this.getCenter()),
		    to = this.project(targetCenter),
		    size = this.getSize(),
		    startZoom = this._zoom;

		targetCenter = toLatLng(targetCenter);
		targetZoom = targetZoom === undefined ? startZoom : targetZoom;

		var w0 = Math.max(size.x, size.y),
		    w1 = w0 * this.getZoomScale(startZoom, targetZoom),
		    u1 = (to.distanceTo(from)) || 1,
		    rho = 1.42,
		    rho2 = rho * rho;

		function r(i) {
			var s1 = i ? -1 : 1,
			    s2 = i ? w1 : w0,
			    t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
			    b1 = 2 * s2 * rho2 * u1,
			    b = t1 / b1,
			    sq = Math.sqrt(b * b + 1) - b;

			    // workaround for floating point precision bug when sq = 0, log = -Infinite,
			    // thus triggering an infinite loop in flyTo
			    var log = sq < 0.000000001 ? -18 : Math.log(sq);

			return log;
		}

		function sinh(n) { return (Math.exp(n) - Math.exp(-n)) / 2; }
		function cosh(n) { return (Math.exp(n) + Math.exp(-n)) / 2; }
		function tanh(n) { return sinh(n) / cosh(n); }

		var r0 = r(0);

		function w(s) { return w0 * (cosh(r0) / cosh(r0 + rho * s)); }
		function u(s) { return w0 * (cosh(r0) * tanh(r0 + rho * s) - sinh(r0)) / rho2; }

		function easeOut(t) { return 1 - Math.pow(1 - t, 1.5); }

		var start = Date.now(),
		    S = (r(1) - r0) / rho,
		    duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

		function frame() {
			var t = (Date.now() - start) / duration,
			    s = easeOut(t) * S;

			if (t <= 1) {
				this._flyToFrame = requestAnimFrame(frame, this);

				this._move(
					this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
					this.getScaleZoom(w0 / w(s), startZoom),
					{flyTo: true});

			} else {
				this
					._move(targetCenter, targetZoom)
					._moveEnd(true);
			}
		}

		this._moveStart(true, options.noMoveStart);

		frame.call(this);
		return this;
	},

	// @method flyToBounds(bounds: LatLngBounds, options?: fitBounds options): this
	// Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
	// but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
	flyToBounds: function (bounds, options) {
		var target = this._getBoundsCenterZoom(bounds, options);
		return this.flyTo(target.center, target.zoom, options);
	},

	// @method setMaxBounds(bounds: Bounds): this
	// Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
	setMaxBounds: function (bounds) {
		bounds = toLatLngBounds(bounds);

		if (!bounds.isValid()) {
			this.options.maxBounds = null;
			return this.off('moveend', this._panInsideMaxBounds);
		} else if (this.options.maxBounds) {
			this.off('moveend', this._panInsideMaxBounds);
		}

		this.options.maxBounds = bounds;

		if (this._loaded) {
			this._panInsideMaxBounds();
		}

		return this.on('moveend', this._panInsideMaxBounds);
	},

	// @method setMinZoom(zoom: Number): this
	// Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
	setMinZoom: function (zoom) {
		var oldZoom = this.options.minZoom;
		this.options.minZoom = zoom;

		if (this._loaded && oldZoom !== zoom) {
			this.fire('zoomlevelschange');

			if (this.getZoom() < this.options.minZoom) {
				return this.setZoom(zoom);
			}
		}

		return this;
	},

	// @method setMaxZoom(zoom: Number): this
	// Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
	setMaxZoom: function (zoom) {
		var oldZoom = this.options.maxZoom;
		this.options.maxZoom = zoom;

		if (this._loaded && oldZoom !== zoom) {
			this.fire('zoomlevelschange');

			if (this.getZoom() > this.options.maxZoom) {
				return this.setZoom(zoom);
			}
		}

		return this;
	},

	// @method panInsideBounds(bounds: LatLngBounds, options?: Pan options): this
	// Pans the map to the closest view that would lie inside the given bounds (if it's not already), controlling the animation using the options specific, if any.
	panInsideBounds: function (bounds, options) {
		this._enforcingBounds = true;
		var center = this.getCenter(),
		    newCenter = this._limitCenter(center, this._zoom, toLatLngBounds(bounds));

		if (!center.equals(newCenter)) {
			this.panTo(newCenter, options);
		}

		this._enforcingBounds = false;
		return this;
	},

	// @method invalidateSize(options: Zoom/pan options): this
	// Checks if the map container size changed and updates the map if so —
	// call it after you've changed the map size dynamically, also animating
	// pan by default. If `options.pan` is `false`, panning will not occur.
	// If `options.debounceMoveend` is `true`, it will delay `moveend` event so
	// that it doesn't happen often even if the method is called many
	// times in a row.

	// @alternative
	// @method invalidateSize(animate: Boolean): this
	// Checks if the map container size changed and updates the map if so —
	// call it after you've changed the map size dynamically, also animating
	// pan by default.
	invalidateSize: function (options) {
		if (!this._loaded) { return this; }

		options = extend({
			animate: false,
			pan: true
		}, options === true ? {animate: true} : options);

		var oldSize = this.getSize();
		this._sizeChanged = true;
		this._lastCenter = null;

		var newSize = this.getSize(),
		    oldCenter = oldSize.divideBy(2).round(),
		    newCenter = newSize.divideBy(2).round(),
		    offset = oldCenter.subtract(newCenter);

		if (!offset.x && !offset.y) { return this; }

		if (options.animate && options.pan) {
			this.panBy(offset);

		} else {
			if (options.pan) {
				this._rawPanBy(offset);
			}

			this.fire('move');

			if (options.debounceMoveend) {
				clearTimeout(this._sizeTimer);
				this._sizeTimer = setTimeout(bind(this.fire, this, 'moveend'), 200);
			} else {
				this.fire('moveend');
			}
		}

		// @section Map state change events
		// @event resize: ResizeEvent
		// Fired when the map is resized.
		return this.fire('resize', {
			oldSize: oldSize,
			newSize: newSize
		});
	},

	// @section Methods for modifying map state
	// @method stop(): this
	// Stops the currently running `panTo` or `flyTo` animation, if any.
	stop: function () {
		this.setZoom(this._limitZoom(this._zoom));
		if (!this.options.zoomSnap) {
			this.fire('viewreset');
		}
		return this._stop();
	},

	// @section Geolocation methods
	// @method locate(options?: Locate options): this
	// Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound)
	// event with location data on success or a [`locationerror`](#map-locationerror) event on failure,
	// and optionally sets the map view to the user's location with respect to
	// detection accuracy (or to the world view if geolocation failed).
	// Note that, if your page doesn't use HTTPS, this method will fail in
	// modern browsers ([Chrome 50 and newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
	// See `Locate options` for more details.
	locate: function (options) {

		options = this._locateOptions = extend({
			timeout: 10000,
			watch: false
			// setView: false
			// maxZoom: <Number>
			// maximumAge: 0
			// enableHighAccuracy: false
		}, options);

		if (!('geolocation' in navigator)) {
			this._handleGeolocationError({
				code: 0,
				message: 'Geolocation not supported.'
			});
			return this;
		}

		var onResponse = bind(this._handleGeolocationResponse, this),
		    onError = bind(this._handleGeolocationError, this);

		if (options.watch) {
			this._locationWatchId =
			        navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}
		return this;
	},

	// @method stopLocate(): this
	// Stops watching location previously initiated by `map.locate({watch: true})`
	// and aborts resetting the map view if map.locate was called with
	// `{setView: true}`.
	stopLocate: function () {
		if (navigator.geolocation && navigator.geolocation.clearWatch) {
			navigator.geolocation.clearWatch(this._locationWatchId);
		}
		if (this._locateOptions) {
			this._locateOptions.setView = false;
		}
		return this;
	},

	_handleGeolocationError: function (error) {
		var c = error.code,
		    message = error.message ||
		            (c === 1 ? 'permission denied' :
		            (c === 2 ? 'position unavailable' : 'timeout'));

		if (this._locateOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		// @section Location events
		// @event locationerror: ErrorEvent
		// Fired when geolocation (using the [`locate`](#map-locate) method) failed.
		this.fire('locationerror', {
			code: c,
			message: 'Geolocation error: ' + message + '.'
		});
	},

	_handleGeolocationResponse: function (pos) {
		var lat = pos.coords.latitude,
		    lng = pos.coords.longitude,
		    latlng = new LatLng(lat, lng),
		    bounds = latlng.toBounds(pos.coords.accuracy),
		    options = this._locateOptions;

		if (options.setView) {
			var zoom = this.getBoundsZoom(bounds);
			this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
		}

		var data = {
			latlng: latlng,
			bounds: bounds,
			timestamp: pos.timestamp
		};

		for (var i in pos.coords) {
			if (typeof pos.coords[i] === 'number') {
				data[i] = pos.coords[i];
			}
		}

		// @event locationfound: LocationEvent
		// Fired when geolocation (using the [`locate`](#map-locate) method)
		// went successfully.
		this.fire('locationfound', data);
	},

	// TODO Appropriate docs section?
	// @section Other Methods
	// @method addHandler(name: String, HandlerClass: Function): this
	// Adds a new `Handler` to the map, given its name and constructor function.
	addHandler: function (name, HandlerClass) {
		if (!HandlerClass) { return this; }

		var handler = this[name] = new HandlerClass(this);

		this._handlers.push(handler);

		if (this.options[name]) {
			handler.enable();
		}

		return this;
	},

	// @method remove(): this
	// Destroys the map and clears all related event listeners.
	remove: function () {

		this._initEvents(true);

		if (this._containerId !== this._container._leaflet_id) {
			throw new Error('Map container is being reused by another instance');
		}

		try {
			// throws error in IE6-8
			delete this._container._leaflet_id;
			delete this._containerId;
		} catch (e) {
			/*eslint-disable */
			this._container._leaflet_id = undefined;
			/* eslint-enable */
			this._containerId = undefined;
		}

		if (this._locationWatchId !== undefined) {
			this.stopLocate();
		}

		this._stop();

		remove(this._mapPane);

		if (this._clearControlPos) {
			this._clearControlPos();
		}

		this._clearHandlers();

		if (this._loaded) {
			// @section Map state change events
			// @event unload: Event
			// Fired when the map is destroyed with [remove](#map-remove) method.
			this.fire('unload');
		}

		var i;
		for (i in this._layers) {
			this._layers[i].remove();
		}
		for (i in this._panes) {
			remove(this._panes[i]);
		}

		this._layers = [];
		this._panes = [];
		delete this._mapPane;
		delete this._renderer;

		return this;
	},

	// @section Other Methods
	// @method createPane(name: String, container?: HTMLElement): HTMLElement
	// Creates a new [map pane](#map-pane) with the given name if it doesn't exist already,
	// then returns it. The pane is created as a child of `container`, or
	// as a child of the main map pane if not set.
	createPane: function (name, container) {
		var className = 'leaflet-pane' + (name ? ' leaflet-' + name.replace('Pane', '') + '-pane' : ''),
		    pane = create$1('div', className, container || this._mapPane);

		if (name) {
			this._panes[name] = pane;
		}
		return pane;
	},

	// @section Methods for Getting Map State

	// @method getCenter(): LatLng
	// Returns the geographical center of the map view
	getCenter: function () {
		this._checkIfLoaded();

		if (this._lastCenter && !this._moved()) {
			return this._lastCenter;
		}
		return this.layerPointToLatLng(this._getCenterLayerPoint());
	},

	// @method getZoom(): Number
	// Returns the current zoom level of the map view
	getZoom: function () {
		return this._zoom;
	},

	// @method getBounds(): LatLngBounds
	// Returns the geographical bounds visible in the current map view
	getBounds: function () {
		var bounds = this.getPixelBounds(),
		    sw = this.unproject(bounds.getBottomLeft()),
		    ne = this.unproject(bounds.getTopRight());

		return new LatLngBounds(sw, ne);
	},

	// @method getMinZoom(): Number
	// Returns the minimum zoom level of the map (if set in the `minZoom` option of the map or of any layers), or `0` by default.
	getMinZoom: function () {
		return this.options.minZoom === undefined ? this._layersMinZoom || 0 : this.options.minZoom;
	},

	// @method getMaxZoom(): Number
	// Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
	getMaxZoom: function () {
		return this.options.maxZoom === undefined ?
			(this._layersMaxZoom === undefined ? Infinity : this._layersMaxZoom) :
			this.options.maxZoom;
	},

	// @method getBoundsZoom(bounds: LatLngBounds, inside?: Boolean): Number
	// Returns the maximum zoom level on which the given bounds fit to the map
	// view in its entirety. If `inside` (optional) is set to `true`, the method
	// instead returns the minimum zoom level on which the map view fits into
	// the given bounds in its entirety.
	getBoundsZoom: function (bounds, inside, padding) { // (LatLngBounds[, Boolean, Point]) -> Number
		bounds = toLatLngBounds(bounds);
		padding = toPoint(padding || [0, 0]);

		var zoom = this.getZoom() || 0,
		    min = this.getMinZoom(),
		    max = this.getMaxZoom(),
		    nw = bounds.getNorthWest(),
		    se = bounds.getSouthEast(),
		    size = this.getSize().subtract(padding),
		    boundsSize = toBounds(this.project(se, zoom), this.project(nw, zoom)).getSize(),
		    snap = any3d ? this.options.zoomSnap : 1,
		    scalex = size.x / boundsSize.x,
		    scaley = size.y / boundsSize.y,
		    scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

		zoom = this.getScaleZoom(scale, zoom);

		if (snap) {
			zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
			zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
		}

		return Math.max(min, Math.min(max, zoom));
	},

	// @method getSize(): Point
	// Returns the current size of the map container (in pixels).
	getSize: function () {
		if (!this._size || this._sizeChanged) {
			this._size = new Point(
				this._container.clientWidth || 0,
				this._container.clientHeight || 0);

			this._sizeChanged = false;
		}
		return this._size.clone();
	},

	// @method getPixelBounds(): Bounds
	// Returns the bounds of the current map view in projected pixel
	// coordinates (sometimes useful in layer and overlay implementations).
	getPixelBounds: function (center, zoom) {
		var topLeftPoint = this._getTopLeftPoint(center, zoom);
		return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
	},

	// TODO: Check semantics - isn't the pixel origin the 0,0 coord relative to
	// the map pane? "left point of the map layer" can be confusing, specially
	// since there can be negative offsets.
	// @method getPixelOrigin(): Point
	// Returns the projected pixel coordinates of the top left point of
	// the map layer (useful in custom layer and overlay implementations).
	getPixelOrigin: function () {
		this._checkIfLoaded();
		return this._pixelOrigin;
	},

	// @method getPixelWorldBounds(zoom?: Number): Bounds
	// Returns the world's bounds in pixel coordinates for zoom level `zoom`.
	// If `zoom` is omitted, the map's current zoom level is used.
	getPixelWorldBounds: function (zoom) {
		return this.options.crs.getProjectedBounds(zoom === undefined ? this.getZoom() : zoom);
	},

	// @section Other Methods

	// @method getPane(pane: String|HTMLElement): HTMLElement
	// Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
	getPane: function (pane) {
		return typeof pane === 'string' ? this._panes[pane] : pane;
	},

	// @method getPanes(): Object
	// Returns a plain object containing the names of all [panes](#map-pane) as keys and
	// the panes as values.
	getPanes: function () {
		return this._panes;
	},

	// @method getContainer: HTMLElement
	// Returns the HTML element that contains the map.
	getContainer: function () {
		return this._container;
	},


	// @section Conversion Methods

	// @method getZoomScale(toZoom: Number, fromZoom: Number): Number
	// Returns the scale factor to be applied to a map transition from zoom level
	// `fromZoom` to `toZoom`. Used internally to help with zoom animations.
	getZoomScale: function (toZoom, fromZoom) {
		// TODO replace with universal implementation after refactoring projections
		var crs = this.options.crs;
		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
		return crs.scale(toZoom) / crs.scale(fromZoom);
	},

	// @method getScaleZoom(scale: Number, fromZoom: Number): Number
	// Returns the zoom level that the map would end up at, if it is at `fromZoom`
	// level and everything is scaled by a factor of `scale`. Inverse of
	// [`getZoomScale`](#map-getZoomScale).
	getScaleZoom: function (scale, fromZoom) {
		var crs = this.options.crs;
		fromZoom = fromZoom === undefined ? this._zoom : fromZoom;
		var zoom = crs.zoom(scale * crs.scale(fromZoom));
		return isNaN(zoom) ? Infinity : zoom;
	},

	// @method project(latlng: LatLng, zoom: Number): Point
	// Projects a geographical coordinate `LatLng` according to the projection
	// of the map's CRS, then scales it according to `zoom` and the CRS's
	// `Transformation`. The result is pixel coordinate relative to
	// the CRS origin.
	project: function (latlng, zoom) {
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.latLngToPoint(toLatLng(latlng), zoom);
	},

	// @method unproject(point: Point, zoom: Number): LatLng
	// Inverse of [`project`](#map-project).
	unproject: function (point, zoom) {
		zoom = zoom === undefined ? this._zoom : zoom;
		return this.options.crs.pointToLatLng(toPoint(point), zoom);
	},

	// @method layerPointToLatLng(point: Point): LatLng
	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
	// returns the corresponding geographical coordinate (for the current zoom level).
	layerPointToLatLng: function (point) {
		var projectedPoint = toPoint(point).add(this.getPixelOrigin());
		return this.unproject(projectedPoint);
	},

	// @method latLngToLayerPoint(latlng: LatLng): Point
	// Given a geographical coordinate, returns the corresponding pixel coordinate
	// relative to the [origin pixel](#map-getpixelorigin).
	latLngToLayerPoint: function (latlng) {
		var projectedPoint = this.project(toLatLng(latlng))._round();
		return projectedPoint._subtract(this.getPixelOrigin());
	},

	// @method wrapLatLng(latlng: LatLng): LatLng
	// Returns a `LatLng` where `lat` and `lng` has been wrapped according to the
	// map's CRS's `wrapLat` and `wrapLng` properties, if they are outside the
	// CRS's bounds.
	// By default this means longitude is wrapped around the dateline so its
	// value is between -180 and +180 degrees.
	wrapLatLng: function (latlng) {
		return this.options.crs.wrapLatLng(toLatLng(latlng));
	},

	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
	// Returns a `LatLngBounds` with the same size as the given one, ensuring that
	// its center is within the CRS's bounds.
	// By default this means the center longitude is wrapped around the dateline so its
	// value is between -180 and +180 degrees, and the majority of the bounds
	// overlaps the CRS's bounds.
	wrapLatLngBounds: function (latlng) {
		return this.options.crs.wrapLatLngBounds(toLatLngBounds(latlng));
	},

	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
	// Returns the distance between two geographical coordinates according to
	// the map's CRS. By default this measures distance in meters.
	distance: function (latlng1, latlng2) {
		return this.options.crs.distance(toLatLng(latlng1), toLatLng(latlng2));
	},

	// @method containerPointToLayerPoint(point: Point): Point
	// Given a pixel coordinate relative to the map container, returns the corresponding
	// pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
	containerPointToLayerPoint: function (point) { // (Point)
		return toPoint(point).subtract(this._getMapPanePos());
	},

	// @method layerPointToContainerPoint(point: Point): Point
	// Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
	// returns the corresponding pixel coordinate relative to the map container.
	layerPointToContainerPoint: function (point) { // (Point)
		return toPoint(point).add(this._getMapPanePos());
	},

	// @method containerPointToLatLng(point: Point): LatLng
	// Given a pixel coordinate relative to the map container, returns
	// the corresponding geographical coordinate (for the current zoom level).
	containerPointToLatLng: function (point) {
		var layerPoint = this.containerPointToLayerPoint(toPoint(point));
		return this.layerPointToLatLng(layerPoint);
	},

	// @method latLngToContainerPoint(latlng: LatLng): Point
	// Given a geographical coordinate, returns the corresponding pixel coordinate
	// relative to the map container.
	latLngToContainerPoint: function (latlng) {
		return this.layerPointToContainerPoint(this.latLngToLayerPoint(toLatLng(latlng)));
	},

	// @method mouseEventToContainerPoint(ev: MouseEvent): Point
	// Given a MouseEvent object, returns the pixel coordinate relative to the
	// map container where the event took place.
	mouseEventToContainerPoint: function (e) {
		return getMousePosition(e, this._container);
	},

	// @method mouseEventToLayerPoint(ev: MouseEvent): Point
	// Given a MouseEvent object, returns the pixel coordinate relative to
	// the [origin pixel](#map-getpixelorigin) where the event took place.
	mouseEventToLayerPoint: function (e) {
		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	},

	// @method mouseEventToLatLng(ev: MouseEvent): LatLng
	// Given a MouseEvent object, returns geographical coordinate where the
	// event took place.
	mouseEventToLatLng: function (e) { // (MouseEvent)
		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	},


	// map initialization methods

	_initContainer: function (id) {
		var container = this._container = get(id);

		if (!container) {
			throw new Error('Map container not found.');
		} else if (container._leaflet_id) {
			throw new Error('Map container is already initialized.');
		}

		on(container, 'scroll', this._onScroll, this);
		this._containerId = stamp(container);
	},

	_initLayout: function () {
		var container = this._container;

		this._fadeAnimated = this.options.fadeAnimation && any3d;

		addClass(container, 'leaflet-container' +
			(touch ? ' leaflet-touch' : '') +
			(retina ? ' leaflet-retina' : '') +
			(ielt9 ? ' leaflet-oldie' : '') +
			(safari ? ' leaflet-safari' : '') +
			(this._fadeAnimated ? ' leaflet-fade-anim' : ''));

		var position = getStyle(container, 'position');

		if (position !== 'absolute' && position !== 'relative' && position !== 'fixed') {
			container.style.position = 'relative';
		}

		this._initPanes();

		if (this._initControlPos) {
			this._initControlPos();
		}
	},

	_initPanes: function () {
		var panes = this._panes = {};
		this._paneRenderers = {};

		// @section
		//
		// Panes are DOM elements used to control the ordering of layers on the map. You
		// can access panes with [`map.getPane`](#map-getpane) or
		// [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
		// [`map.createPane`](#map-createpane) method.
		//
		// Every map has the following default panes that differ only in zIndex.
		//
		// @pane mapPane: HTMLElement = 'auto'
		// Pane that contains all other map panes

		this._mapPane = this.createPane('mapPane', this._container);
		setPosition(this._mapPane, new Point(0, 0));

		// @pane tilePane: HTMLElement = 200
		// Pane for `GridLayer`s and `TileLayer`s
		this.createPane('tilePane');
		// @pane overlayPane: HTMLElement = 400
		// Pane for vectors (`Path`s, like `Polyline`s and `Polygon`s), `ImageOverlay`s and `VideoOverlay`s
		this.createPane('shadowPane');
		// @pane shadowPane: HTMLElement = 500
		// Pane for overlay shadows (e.g. `Marker` shadows)
		this.createPane('overlayPane');
		// @pane markerPane: HTMLElement = 600
		// Pane for `Icon`s of `Marker`s
		this.createPane('markerPane');
		// @pane tooltipPane: HTMLElement = 650
		// Pane for `Tooltip`s.
		this.createPane('tooltipPane');
		// @pane popupPane: HTMLElement = 700
		// Pane for `Popup`s.
		this.createPane('popupPane');

		if (!this.options.markerZoomAnimation) {
			addClass(panes.markerPane, 'leaflet-zoom-hide');
			addClass(panes.shadowPane, 'leaflet-zoom-hide');
		}
	},


	// private methods that modify map state

	// @section Map state change events
	_resetView: function (center, zoom) {
		setPosition(this._mapPane, new Point(0, 0));

		var loading = !this._loaded;
		this._loaded = true;
		zoom = this._limitZoom(zoom);

		this.fire('viewprereset');

		var zoomChanged = this._zoom !== zoom;
		this
			._moveStart(zoomChanged, false)
			._move(center, zoom)
			._moveEnd(zoomChanged);

		// @event viewreset: Event
		// Fired when the map needs to redraw its content (this usually happens
		// on map zoom or load). Very useful for creating custom overlays.
		this.fire('viewreset');

		// @event load: Event
		// Fired when the map is initialized (when its center and zoom are set
		// for the first time).
		if (loading) {
			this.fire('load');
		}
	},

	_moveStart: function (zoomChanged, noMoveStart) {
		// @event zoomstart: Event
		// Fired when the map zoom is about to change (e.g. before zoom animation).
		// @event movestart: Event
		// Fired when the view of the map starts changing (e.g. user starts dragging the map).
		if (zoomChanged) {
			this.fire('zoomstart');
		}
		if (!noMoveStart) {
			this.fire('movestart');
		}
		return this;
	},

	_move: function (center, zoom, data) {
		if (zoom === undefined) {
			zoom = this._zoom;
		}
		var zoomChanged = this._zoom !== zoom;

		this._zoom = zoom;
		this._lastCenter = center;
		this._pixelOrigin = this._getNewPixelOrigin(center);

		// @event zoom: Event
		// Fired repeatedly during any change in zoom level, including zoom
		// and fly animations.
		if (zoomChanged || (data && data.pinch)) {	// Always fire 'zoom' if pinching because #3530
			this.fire('zoom', data);
		}

		// @event move: Event
		// Fired repeatedly during any movement of the map, including pan and
		// fly animations.
		return this.fire('move', data);
	},

	_moveEnd: function (zoomChanged) {
		// @event zoomend: Event
		// Fired when the map has changed, after any animations.
		if (zoomChanged) {
			this.fire('zoomend');
		}

		// @event moveend: Event
		// Fired when the center of the map stops changing (e.g. user stopped
		// dragging the map).
		return this.fire('moveend');
	},

	_stop: function () {
		cancelAnimFrame(this._flyToFrame);
		if (this._panAnim) {
			this._panAnim.stop();
		}
		return this;
	},

	_rawPanBy: function (offset) {
		setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
	},

	_getZoomSpan: function () {
		return this.getMaxZoom() - this.getMinZoom();
	},

	_panInsideMaxBounds: function () {
		if (!this._enforcingBounds) {
			this.panInsideBounds(this.options.maxBounds);
		}
	},

	_checkIfLoaded: function () {
		if (!this._loaded) {
			throw new Error('Set map center and zoom first.');
		}
	},

	// DOM event handling

	// @section Interaction events
	_initEvents: function (remove$$1) {
		this._targets = {};
		this._targets[stamp(this._container)] = this;

		var onOff = remove$$1 ? off : on;

		// @event click: MouseEvent
		// Fired when the user clicks (or taps) the map.
		// @event dblclick: MouseEvent
		// Fired when the user double-clicks (or double-taps) the map.
		// @event mousedown: MouseEvent
		// Fired when the user pushes the mouse button on the map.
		// @event mouseup: MouseEvent
		// Fired when the user releases the mouse button on the map.
		// @event mouseover: MouseEvent
		// Fired when the mouse enters the map.
		// @event mouseout: MouseEvent
		// Fired when the mouse leaves the map.
		// @event mousemove: MouseEvent
		// Fired while the mouse moves over the map.
		// @event contextmenu: MouseEvent
		// Fired when the user pushes the right mouse button on the map, prevents
		// default browser context menu from showing if there are listeners on
		// this event. Also fired on mobile when the user holds a single touch
		// for a second (also called long press).
		// @event keypress: KeyboardEvent
		// Fired when the user presses a key from the keyboard while the map is focused.
		onOff(this._container, 'click dblclick mousedown mouseup ' +
			'mouseover mouseout mousemove contextmenu keypress', this._handleDOMEvent, this);

		if (this.options.trackResize) {
			onOff(window, 'resize', this._onResize, this);
		}

		if (any3d && this.options.transform3DLimit) {
			(remove$$1 ? this.off : this.on).call(this, 'moveend', this._onMoveEnd);
		}
	},

	_onResize: function () {
		cancelAnimFrame(this._resizeRequest);
		this._resizeRequest = requestAnimFrame(
		        function () { this.invalidateSize({debounceMoveend: true}); }, this);
	},

	_onScroll: function () {
		this._container.scrollTop  = 0;
		this._container.scrollLeft = 0;
	},

	_onMoveEnd: function () {
		var pos = this._getMapPanePos();
		if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
			// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
			// a pixel offset on very high values, see: http://jsfiddle.net/dg6r5hhb/
			this._resetView(this.getCenter(), this.getZoom());
		}
	},

	_findEventTargets: function (e, type) {
		var targets = [],
		    target,
		    isHover = type === 'mouseout' || type === 'mouseover',
		    src = e.target || e.srcElement,
		    dragging = false;

		while (src) {
			target = this._targets[stamp(src)];
			if (target && (type === 'click' || type === 'preclick') && !e._simulated && this._draggableMoved(target)) {
				// Prevent firing click after you just dragged an object.
				dragging = true;
				break;
			}
			if (target && target.listens(type, true)) {
				if (isHover && !isExternalTarget(src, e)) { break; }
				targets.push(target);
				if (isHover) { break; }
			}
			if (src === this._container) { break; }
			src = src.parentNode;
		}
		if (!targets.length && !dragging && !isHover && isExternalTarget(src, e)) {
			targets = [this];
		}
		return targets;
	},

	_handleDOMEvent: function (e) {
		if (!this._loaded || skipped(e)) { return; }

		var type = e.type;

		if (type === 'mousedown' || type === 'keypress') {
			// prevents outline when clicking on keyboard-focusable element
			preventOutline(e.target || e.srcElement);
		}

		this._fireDOMEvent(e, type);
	},

	_mouseEvents: ['click', 'dblclick', 'mouseover', 'mouseout', 'contextmenu'],

	_fireDOMEvent: function (e, type, targets) {

		if (e.type === 'click') {
			// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
			// @event preclick: MouseEvent
			// Fired before mouse click on the map (sometimes useful when you
			// want something to happen on click before any existing click
			// handlers start running).
			var synth = extend({}, e);
			synth.type = 'preclick';
			this._fireDOMEvent(synth, synth.type, targets);
		}

		if (e._stopped) { return; }

		// Find the layer the event is propagating from and its parents.
		targets = (targets || []).concat(this._findEventTargets(e, type));

		if (!targets.length) { return; }

		var target = targets[0];
		if (type === 'contextmenu' && target.listens(type, true)) {
			preventDefault(e);
		}

		var data = {
			originalEvent: e
		};

		if (e.type !== 'keypress') {
			var isMarker = target.getLatLng && (!target._radius || target._radius <= 10);
			data.containerPoint = isMarker ?
				this.latLngToContainerPoint(target.getLatLng()) : this.mouseEventToContainerPoint(e);
			data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
			data.latlng = isMarker ? target.getLatLng() : this.layerPointToLatLng(data.layerPoint);
		}

		for (var i = 0; i < targets.length; i++) {
			targets[i].fire(type, data, true);
			if (data.originalEvent._stopped ||
				(targets[i].options.bubblingMouseEvents === false && indexOf(this._mouseEvents, type) !== -1)) { return; }
		}
	},

	_draggableMoved: function (obj) {
		obj = obj.dragging && obj.dragging.enabled() ? obj : this;
		return (obj.dragging && obj.dragging.moved()) || (this.boxZoom && this.boxZoom.moved());
	},

	_clearHandlers: function () {
		for (var i = 0, len = this._handlers.length; i < len; i++) {
			this._handlers[i].disable();
		}
	},

	// @section Other Methods

	// @method whenReady(fn: Function, context?: Object): this
	// Runs the given function `fn` when the map gets initialized with
	// a view (center and zoom) and at least one layer, or immediately
	// if it's already initialized, optionally passing a function context.
	whenReady: function (callback, context) {
		if (this._loaded) {
			callback.call(context || this, {target: this});
		} else {
			this.on('load', callback, context);
		}
		return this;
	},


	// private methods for getting map state

	_getMapPanePos: function () {
		return getPosition(this._mapPane) || new Point(0, 0);
	},

	_moved: function () {
		var pos = this._getMapPanePos();
		return pos && !pos.equals([0, 0]);
	},

	_getTopLeftPoint: function (center, zoom) {
		var pixelOrigin = center && zoom !== undefined ?
			this._getNewPixelOrigin(center, zoom) :
			this.getPixelOrigin();
		return pixelOrigin.subtract(this._getMapPanePos());
	},

	_getNewPixelOrigin: function (center, zoom) {
		var viewHalf = this.getSize()._divideBy(2);
		return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
	},

	_latLngToNewLayerPoint: function (latlng, zoom, center) {
		var topLeft = this._getNewPixelOrigin(center, zoom);
		return this.project(latlng, zoom)._subtract(topLeft);
	},

	_latLngBoundsToNewLayerBounds: function (latLngBounds, zoom, center) {
		var topLeft = this._getNewPixelOrigin(center, zoom);
		return toBounds([
			this.project(latLngBounds.getSouthWest(), zoom)._subtract(topLeft),
			this.project(latLngBounds.getNorthWest(), zoom)._subtract(topLeft),
			this.project(latLngBounds.getSouthEast(), zoom)._subtract(topLeft),
			this.project(latLngBounds.getNorthEast(), zoom)._subtract(topLeft)
		]);
	},

	// layer point of the current center
	_getCenterLayerPoint: function () {
		return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
	},

	// offset of the specified place to the current center in pixels
	_getCenterOffset: function (latlng) {
		return this.latLngToLayerPoint(latlng).subtract(this._getCenterLayerPoint());
	},

	// adjust center for view to get inside bounds
	_limitCenter: function (center, zoom, bounds) {

		if (!bounds) { return center; }

		var centerPoint = this.project(center, zoom),
		    viewHalf = this.getSize().divideBy(2),
		    viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
		    offset = this._getBoundsOffset(viewBounds, bounds, zoom);

		// If offset is less than a pixel, ignore.
		// This prevents unstable projections from getting into
		// an infinite loop of tiny offsets.
		if (offset.round().equals([0, 0])) {
			return center;
		}

		return this.unproject(centerPoint.add(offset), zoom);
	},

	// adjust offset for view to get inside bounds
	_limitOffset: function (offset, bounds) {
		if (!bounds) { return offset; }

		var viewBounds = this.getPixelBounds(),
		    newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

		return offset.add(this._getBoundsOffset(newBounds, bounds));
	},

	// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
	_getBoundsOffset: function (pxBounds, maxBounds, zoom) {
		var projectedMaxBounds = toBounds(
		        this.project(maxBounds.getNorthEast(), zoom),
		        this.project(maxBounds.getSouthWest(), zoom)
		    ),
		    minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
		    maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),

		    dx = this._rebound(minOffset.x, -maxOffset.x),
		    dy = this._rebound(minOffset.y, -maxOffset.y);

		return new Point(dx, dy);
	},

	_rebound: function (left, right) {
		return left + right > 0 ?
			Math.round(left - right) / 2 :
			Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
	},

	_limitZoom: function (zoom) {
		var min = this.getMinZoom(),
		    max = this.getMaxZoom(),
		    snap = any3d ? this.options.zoomSnap : 1;
		if (snap) {
			zoom = Math.round(zoom / snap) * snap;
		}
		return Math.max(min, Math.min(max, zoom));
	},

	_onPanTransitionStep: function () {
		this.fire('move');
	},

	_onPanTransitionEnd: function () {
		removeClass(this._mapPane, 'leaflet-pan-anim');
		this.fire('moveend');
	},

	_tryAnimatedPan: function (center, options) {
		// difference between the new and current centers in pixels
		var offset = this._getCenterOffset(center)._trunc();

		// don't animate too far unless animate: true specified in options
		if ((options && options.animate) !== true && !this.getSize().contains(offset)) { return false; }

		this.panBy(offset, options);

		return true;
	},

	_createAnimProxy: function () {

		var proxy = this._proxy = create$1('div', 'leaflet-proxy leaflet-zoom-animated');
		this._panes.mapPane.appendChild(proxy);

		this.on('zoomanim', function (e) {
			var prop = TRANSFORM,
			    transform = this._proxy.style[prop];

			setTransform(this._proxy, this.project(e.center, e.zoom), this.getZoomScale(e.zoom, 1));

			// workaround for case when transform is the same and so transitionend event is not fired
			if (transform === this._proxy.style[prop] && this._animatingZoom) {
				this._onZoomTransitionEnd();
			}
		}, this);

		this.on('load moveend', function () {
			var c = this.getCenter(),
			    z = this.getZoom();
			setTransform(this._proxy, this.project(c, z), this.getZoomScale(z, 1));
		}, this);

		this._on('unload', this._destroyAnimProxy, this);
	},

	_destroyAnimProxy: function () {
		remove(this._proxy);
		delete this._proxy;
	},

	_catchTransitionEnd: function (e) {
		if (this._animatingZoom && e.propertyName.indexOf('transform') >= 0) {
			this._onZoomTransitionEnd();
		}
	},

	_nothingToAnimate: function () {
		return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
	},

	_tryAnimatedZoom: function (center, zoom, options) {

		if (this._animatingZoom) { return true; }

		options = options || {};

		// don't animate if disabled, not supported or zoom difference is too large
		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
		        Math.abs(zoom - this._zoom) > this.options.zoomAnimationThreshold) { return false; }

		// offset is the pixel coords of the zoom origin relative to the current center
		var scale = this.getZoomScale(zoom),
		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

		requestAnimFrame(function () {
			this
			    ._moveStart(true, false)
			    ._animateZoom(center, zoom, true);
		}, this);

		return true;
	},

	_animateZoom: function (center, zoom, startAnim, noUpdate) {
		if (!this._mapPane) { return; }

		if (startAnim) {
			this._animatingZoom = true;

			// remember what center/zoom to set after animation
			this._animateToCenter = center;
			this._animateToZoom = zoom;

			addClass(this._mapPane, 'leaflet-zoom-anim');
		}

		// @event zoomanim: ZoomAnimEvent
		// Fired on every frame of a zoom animation
		this.fire('zoomanim', {
			center: center,
			zoom: zoom,
			noUpdate: noUpdate
		});

		// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
		setTimeout(bind(this._onZoomTransitionEnd, this), 250);
	},

	_onZoomTransitionEnd: function () {
		if (!this._animatingZoom) { return; }

		if (this._mapPane) {
			removeClass(this._mapPane, 'leaflet-zoom-anim');
		}

		this._animatingZoom = false;

		this._move(this._animateToCenter, this._animateToZoom);

		// This anim frame should prevent an obscure iOS webkit tile loading race condition.
		requestAnimFrame(function () {
			this._moveEnd(true);
		}, this);
	}
});

// @section

// @factory L.map(id: String, options?: Map options)
// Instantiates a map object given the DOM ID of a `<div>` element
// and optionally an object literal with `Map options`.
//
// @alternative
// @factory L.map(el: HTMLElement, options?: Map options)
// Instantiates a map object given an instance of a `<div>` HTML element
// and optionally an object literal with `Map options`.
function createMap(id, options) {
	return new Map(id, options);
}

/*
 * @class Control
 * @aka L.Control
 * @inherits Class
 *
 * L.Control is a base class for implementing map controls. Handles positioning.
 * All other controls extend from this class.
 */

var Control = Class.extend({
	// @section
	// @aka Control options
	options: {
		// @option position: String = 'topright'
		// The position of the control (one of the map corners). Possible values are `'topleft'`,
		// `'topright'`, `'bottomleft'` or `'bottomright'`
		position: 'topright'
	},

	initialize: function (options) {
		setOptions(this, options);
	},

	/* @section
	 * Classes extending L.Control will inherit the following methods:
	 *
	 * @method getPosition: string
	 * Returns the position of the control.
	 */
	getPosition: function () {
		return this.options.position;
	},

	// @method setPosition(position: string): this
	// Sets the position of the control.
	setPosition: function (position) {
		var map = this._map;

		if (map) {
			map.removeControl(this);
		}

		this.options.position = position;

		if (map) {
			map.addControl(this);
		}

		return this;
	},

	// @method getContainer: HTMLElement
	// Returns the HTMLElement that contains the control.
	getContainer: function () {
		return this._container;
	},

	// @method addTo(map: Map): this
	// Adds the control to the given map.
	addTo: function (map) {
		this.remove();
		this._map = map;

		var container = this._container = this.onAdd(map),
		    pos = this.getPosition(),
		    corner = map._controlCorners[pos];

		addClass(container, 'leaflet-control');

		if (pos.indexOf('bottom') !== -1) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}

		return this;
	},

	// @method remove: this
	// Removes the control from the map it is currently active on.
	remove: function () {
		if (!this._map) {
			return this;
		}

		remove(this._container);

		if (this.onRemove) {
			this.onRemove(this._map);
		}

		this._map = null;

		return this;
	},

	_refocusOnMap: function (e) {
		// if map exists and event is not a keyboard event
		if (this._map && e && e.screenX > 0 && e.screenY > 0) {
			this._map.getContainer().focus();
		}
	}
});

var control = function (options) {
	return new Control(options);
};

/* @section Extension methods
 * @uninheritable
 *
 * Every control should extend from `L.Control` and (re-)implement the following methods.
 *
 * @method onAdd(map: Map): HTMLElement
 * Should return the container DOM element for the control and add listeners on relevant map events. Called on [`control.addTo(map)`](#control-addTo).
 *
 * @method onRemove(map: Map)
 * Optional method. Should contain all clean up code that removes the listeners previously added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
 */

/* @namespace Map
 * @section Methods for Layers and Controls
 */
Map.include({
	// @method addControl(control: Control): this
	// Adds the given control to the map
	addControl: function (control) {
		control.addTo(this);
		return this;
	},

	// @method removeControl(control: Control): this
	// Removes the given control from the map
	removeControl: function (control) {
		control.remove();
		return this;
	},

	_initControlPos: function () {
		var corners = this._controlCorners = {},
		    l = 'leaflet-',
		    container = this._controlContainer =
		            create$1('div', l + 'control-container', this._container);

		function createCorner(vSide, hSide) {
			var className = l + vSide + ' ' + l + hSide;

			corners[vSide + hSide] = create$1('div', className, container);
		}

		createCorner('top', 'left');
		createCorner('top', 'right');
		createCorner('bottom', 'left');
		createCorner('bottom', 'right');
	},

	_clearControlPos: function () {
		for (var i in this._controlCorners) {
			remove(this._controlCorners[i]);
		}
		remove(this._controlContainer);
		delete this._controlCorners;
		delete this._controlContainer;
	}
});

/*
 * @class Control.Layers
 * @aka L.Control.Layers
 * @inherits Control
 *
 * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](http://leafletjs.com/examples/layers-control/)). Extends `Control`.
 *
 * @example
 *
 * ```js
 * var baseLayers = {
 * 	"Mapbox": mapbox,
 * 	"OpenStreetMap": osm
 * };
 *
 * var overlays = {
 * 	"Marker": marker,
 * 	"Roads": roadsLayer
 * };
 *
 * L.control.layers(baseLayers, overlays).addTo(map);
 * ```
 *
 * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
 *
 * ```js
 * {
 *     "<someName1>": layer1,
 *     "<someName2>": layer2
 * }
 * ```
 *
 * The layer names can contain HTML, which allows you to add additional styling to the items:
 *
 * ```js
 * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
 * ```
 */

var Layers = Control.extend({
	// @section
	// @aka Control.Layers options
	options: {
		// @option collapsed: Boolean = true
		// If `true`, the control will be collapsed into an icon and expanded on mouse hover or touch.
		collapsed: true,
		position: 'topright',

		// @option autoZIndex: Boolean = true
		// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
		autoZIndex: true,

		// @option hideSingleBase: Boolean = false
		// If `true`, the base layers in the control will be hidden when there is only one.
		hideSingleBase: false,

		// @option sortLayers: Boolean = false
		// Whether to sort the layers. When `false`, layers will keep the order
		// in which they were added to the control.
		sortLayers: false,

		// @option sortFunction: Function = *
		// A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
		// that will be used for sorting the layers, when `sortLayers` is `true`.
		// The function receives both the `L.Layer` instances and their names, as in
		// `sortFunction(layerA, layerB, nameA, nameB)`.
		// By default, it sorts layers alphabetically by their name.
		sortFunction: function (layerA, layerB, nameA, nameB) {
			return nameA < nameB ? -1 : (nameB < nameA ? 1 : 0);
		}
	},

	initialize: function (baseLayers, overlays, options) {
		setOptions(this, options);

		this._layerControlInputs = [];
		this._layers = [];
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},

	onAdd: function (map) {
		this._initLayout();
		this._update();

		this._map = map;
		map.on('zoomend', this._checkDisabledLayers, this);

		for (var i = 0; i < this._layers.length; i++) {
			this._layers[i].layer.on('add remove', this._onLayerChange, this);
		}

		return this._container;
	},

	addTo: function (map) {
		Control.prototype.addTo.call(this, map);
		// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
		return this._expandIfNotCollapsed();
	},

	onRemove: function () {
		this._map.off('zoomend', this._checkDisabledLayers, this);

		for (var i = 0; i < this._layers.length; i++) {
			this._layers[i].layer.off('add remove', this._onLayerChange, this);
		}
	},

	// @method addBaseLayer(layer: Layer, name: String): this
	// Adds a base layer (radio button entry) with the given name to the control.
	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		return (this._map) ? this._update() : this;
	},

	// @method addOverlay(layer: Layer, name: String): this
	// Adds an overlay (checkbox entry) with the given name to the control.
	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		return (this._map) ? this._update() : this;
	},

	// @method removeLayer(layer: Layer): this
	// Remove the given layer from the control.
	removeLayer: function (layer) {
		layer.off('add remove', this._onLayerChange, this);

		var obj = this._getLayer(stamp(layer));
		if (obj) {
			this._layers.splice(this._layers.indexOf(obj), 1);
		}
		return (this._map) ? this._update() : this;
	},

	// @method expand(): this
	// Expand the control container if collapsed.
	expand: function () {
		addClass(this._container, 'leaflet-control-layers-expanded');
		this._form.style.height = null;
		var acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
		if (acceptableHeight < this._form.clientHeight) {
			addClass(this._form, 'leaflet-control-layers-scrollbar');
			this._form.style.height = acceptableHeight + 'px';
		} else {
			removeClass(this._form, 'leaflet-control-layers-scrollbar');
		}
		this._checkDisabledLayers();
		return this;
	},

	// @method collapse(): this
	// Collapse the control container if expanded.
	collapse: function () {
		removeClass(this._container, 'leaflet-control-layers-expanded');
		return this;
	},

	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = create$1('div', className),
		    collapsed = this.options.collapsed;

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		disableClickPropagation(container);
		disableScrollPropagation(container);

		var form = this._form = create$1('form', className + '-list');

		if (collapsed) {
			this._map.on('click', this.collapse, this);

			if (!android) {
				on(container, {
					mouseenter: this.expand,
					mouseleave: this.collapse
				}, this);
			}
		}

		var link = this._layersLink = create$1('a', className + '-toggle', container);
		link.href = '#';
		link.title = 'Layers';

		if (touch) {
			on(link, 'click', stop);
			on(link, 'click', this.expand, this);
		} else {
			on(link, 'focus', this.expand, this);
		}

		if (!collapsed) {
			this.expand();
		}

		this._baseLayersList = create$1('div', className + '-base', form);
		this._separator = create$1('div', className + '-separator', form);
		this._overlaysList = create$1('div', className + '-overlays', form);

		container.appendChild(form);
	},

	_getLayer: function (id) {
		for (var i = 0; i < this._layers.length; i++) {

			if (this._layers[i] && stamp(this._layers[i].layer) === id) {
				return this._layers[i];
			}
		}
	},

	_addLayer: function (layer, name, overlay) {
		if (this._map) {
			layer.on('add remove', this._onLayerChange, this);
		}

		this._layers.push({
			layer: layer,
			name: name,
			overlay: overlay
		});

		if (this.options.sortLayers) {
			this._layers.sort(bind(function (a, b) {
				return this.options.sortFunction(a.layer, b.layer, a.name, b.name);
			}, this));
		}

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}

		this._expandIfNotCollapsed();
	},

	_update: function () {
		if (!this._container) { return this; }

		empty(this._baseLayersList);
		empty(this._overlaysList);

		this._layerControlInputs = [];
		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

		for (i = 0; i < this._layers.length; i++) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
		}

		// Hide base layers section if there's only one layer.
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

		return this;
	},

	_onLayerChange: function (e) {
		if (!this._handlingClick) {
			this._update();
		}

		var obj = this._getLayer(stamp(e.target));

		// @namespace Map
		// @section Layer events
		// @event baselayerchange: LayersControlEvent
		// Fired when the base layer is changed through the [layer control](#control-layers).
		// @event overlayadd: LayersControlEvent
		// Fired when an overlay is selected through the [layer control](#control-layers).
		// @event overlayremove: LayersControlEvent
		// Fired when an overlay is deselected through the [layer control](#control-layers).
		// @namespace Control.Layers
		var type = obj.overlay ?
			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'add' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, obj);
		}
	},

	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},

	_addItem: function (obj) {
		var label = document.createElement('label'),
		    checked = this._map.hasLayer(obj.layer),
		    input;

		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		this._layerControlInputs.push(input);
		input.layerId = stamp(obj.layer);

		on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		this._checkDisabledLayers();
		return label;
	},

	_onInputClick: function () {
		var inputs = this._layerControlInputs,
		    input, layer;
		var addedLayers = [],
		    removedLayers = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;

			if (input.checked) {
				addedLayers.push(layer);
			} else if (!input.checked) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedLayers.length; i++) {
			if (this._map.hasLayer(removedLayers[i])) {
				this._map.removeLayer(removedLayers[i]);
			}
		}
		for (i = 0; i < addedLayers.length; i++) {
			if (!this._map.hasLayer(addedLayers[i])) {
				this._map.addLayer(addedLayers[i]);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap();
	},

	_checkDisabledLayers: function () {
		var inputs = this._layerControlInputs,
		    input,
		    layer,
		    zoom = this._map.getZoom();

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._getLayer(input.layerId).layer;
			input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
			                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

		}
	},

	_expandIfNotCollapsed: function () {
		if (this._map && !this.options.collapsed) {
			this.expand();
		}
		return this;
	},

	_expand: function () {
		// Backward compatibility, remove me in 1.1.
		return this.expand();
	},

	_collapse: function () {
		// Backward compatibility, remove me in 1.1.
		return this.collapse();
	}

});


// @factory L.control.layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
// Creates an attribution control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
var layers = function (baseLayers, overlays, options) {
	return new Layers(baseLayers, overlays, options);
};

/*
 * @class Control.Zoom
 * @aka L.Control.Zoom
 * @inherits Control
 *
 * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
 */

var Zoom = Control.extend({
	// @section
	// @aka Control.Zoom options
	options: {
		position: 'topleft',

		// @option zoomInText: String = '+'
		// The text set on the 'zoom in' button.
		zoomInText: '+',

		// @option zoomInTitle: String = 'Zoom in'
		// The title set on the 'zoom in' button.
		zoomInTitle: 'Zoom in',

		// @option zoomOutText: String = '&#x2212;'
		// The text set on the 'zoom out' button.
		zoomOutText: '&#x2212;',

		// @option zoomOutTitle: String = 'Zoom out'
		// The title set on the 'zoom out' button.
		zoomOutTitle: 'Zoom out'
	},

	onAdd: function (map) {
		var zoomName = 'leaflet-control-zoom',
		    container = create$1('div', zoomName + ' leaflet-bar'),
		    options = this.options;

		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
		        zoomName + '-in',  container, this._zoomIn);
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
		        zoomName + '-out', container, this._zoomOut);

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	},

	onRemove: function (map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	},

	disable: function () {
		this._disabled = true;
		this._updateDisabled();
		return this;
	},

	enable: function () {
		this._disabled = false;
		this._updateDisabled();
		return this;
	},

	_zoomIn: function (e) {
		if (!this._disabled && this._map._zoom < this._map.getMaxZoom()) {
			this._map.zoomIn(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_zoomOut: function (e) {
		if (!this._disabled && this._map._zoom > this._map.getMinZoom()) {
			this._map.zoomOut(this._map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	},

	_createButton: function (html, title, className, container, fn) {
		var link = create$1('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		disableClickPropagation(link);
		on(link, 'click', stop);
		on(link, 'click', fn, this);
		on(link, 'click', this._refocusOnMap, this);

		return link;
	},

	_updateDisabled: function () {
		var map = this._map,
		    className = 'leaflet-disabled';

		removeClass(this._zoomInButton, className);
		removeClass(this._zoomOutButton, className);

		if (this._disabled || map._zoom === map.getMinZoom()) {
			addClass(this._zoomOutButton, className);
		}
		if (this._disabled || map._zoom === map.getMaxZoom()) {
			addClass(this._zoomInButton, className);
		}
	}
});

// @namespace Map
// @section Control options
// @option zoomControl: Boolean = true
// Whether a [zoom control](#control-zoom) is added to the map by default.
Map.mergeOptions({
	zoomControl: true
});

Map.addInitHook(function () {
	if (this.options.zoomControl) {
		this.zoomControl = new Zoom();
		this.addControl(this.zoomControl);
	}
});

// @namespace Control.Zoom
// @factory L.control.zoom(options: Control.Zoom options)
// Creates a zoom control
var zoom = function (options) {
	return new Zoom(options);
};

/*
 * @class Control.Scale
 * @aka L.Control.Scale
 * @inherits Control
 *
 * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
 *
 * @example
 *
 * ```js
 * L.control.scale().addTo(map);
 * ```
 */

var Scale = Control.extend({
	// @section
	// @aka Control.Scale options
	options: {
		position: 'bottomleft',

		// @option maxWidth: Number = 100
		// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
		maxWidth: 100,

		// @option metric: Boolean = True
		// Whether to show the metric scale line (m/km).
		metric: true,

		// @option imperial: Boolean = True
		// Whether to show the imperial scale line (mi/ft).
		imperial: true

		// @option updateWhenIdle: Boolean = false
		// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
	},

	onAdd: function (map) {
		var className = 'leaflet-control-scale',
		    container = create$1('div', className),
		    options = this.options;

		this._addScales(options, className + '-line', container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	},

	onRemove: function (map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_addScales: function (options, className, container) {
		if (options.metric) {
			this._mScale = create$1('div', className, container);
		}
		if (options.imperial) {
			this._iScale = create$1('div', className, container);
		}
	},

	_update: function () {
		var map = this._map,
		    y = map.getSize().y / 2;

		var maxMeters = map.distance(
			map.containerPointToLatLng([0, y]),
			map.containerPointToLatLng([this.options.maxWidth, y]));

		this._updateScales(maxMeters);
	},

	_updateScales: function (maxMeters) {
		if (this.options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}
		if (this.options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	},

	_updateMetric: function (maxMeters) {
		var meters = this._getRoundNum(maxMeters),
		    label = meters < 1000 ? meters + ' m' : (meters / 1000) + ' km';

		this._updateScale(this._mScale, label, meters / maxMeters);
	},

	_updateImperial: function (maxMeters) {
		var maxFeet = maxMeters * 3.2808399,
		    maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);
			this._updateScale(this._iScale, miles + ' mi', miles / maxMiles);

		} else {
			feet = this._getRoundNum(maxFeet);
			this._updateScale(this._iScale, feet + ' ft', feet / maxFeet);
		}
	},

	_updateScale: function (scale, text, ratio) {
		scale.style.width = Math.round(this.options.maxWidth * ratio) + 'px';
		scale.innerHTML = text;
	},

	_getRoundNum: function (num) {
		var pow10 = Math.pow(10, (Math.floor(num) + '').length - 1),
		    d = num / pow10;

		d = d >= 10 ? 10 :
		    d >= 5 ? 5 :
		    d >= 3 ? 3 :
		    d >= 2 ? 2 : 1;

		return pow10 * d;
	}
});


// @factory L.control.scale(options?: Control.Scale options)
// Creates an scale control with the given options.
var scale = function (options) {
	return new Scale(options);
};

/*
 * @class Control.Attribution
 * @aka L.Control.Attribution
 * @inherits Control
 *
 * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
 */

var Attribution = Control.extend({
	// @section
	// @aka Control.Attribution options
	options: {
		position: 'bottomright',

		// @option prefix: String = 'Leaflet'
		// The HTML text shown before the attributions. Pass `false` to disable.
		prefix: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>'
	},

	initialize: function (options) {
		setOptions(this, options);

		this._attributions = {};
	},

	onAdd: function (map) {
		map.attributionControl = this;
		this._container = create$1('div', 'leaflet-control-attribution');
		disableClickPropagation(this._container);

		// TODO ugly, refactor
		for (var i in map._layers) {
			if (map._layers[i].getAttribution) {
				this.addAttribution(map._layers[i].getAttribution());
			}
		}

		this._update();

		return this._container;
	},

	// @method setPrefix(prefix: String): this
	// Sets the text before the attributions.
	setPrefix: function (prefix) {
		this.options.prefix = prefix;
		this._update();
		return this;
	},

	// @method addAttribution(text: String): this
	// Adds an attribution text (e.g. `'Vector data &copy; Mapbox'`).
	addAttribution: function (text) {
		if (!text) { return this; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();

		return this;
	},

	// @method removeAttribution(text: String): this
	// Removes an attribution text.
	removeAttribution: function (text) {
		if (!text) { return this; }

		if (this._attributions[text]) {
			this._attributions[text]--;
			this._update();
		}

		return this;
	},

	_update: function () {
		if (!this._map) { return; }

		var attribs = [];

		for (var i in this._attributions) {
			if (this._attributions[i]) {
				attribs.push(i);
			}
		}

		var prefixAndAttribs = [];

		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' | ');
	}
});

// @namespace Map
// @section Control options
// @option attributionControl: Boolean = true
// Whether a [attribution control](#control-attribution) is added to the map by default.
Map.mergeOptions({
	attributionControl: true
});

Map.addInitHook(function () {
	if (this.options.attributionControl) {
		new Attribution().addTo(this);
	}
});

// @namespace Control.Attribution
// @factory L.control.attribution(options: Control.Attribution options)
// Creates an attribution control.
var attribution = function (options) {
	return new Attribution(options);
};

Control.Layers = Layers;
Control.Zoom = Zoom;
Control.Scale = Scale;
Control.Attribution = Attribution;

control.layers = layers;
control.zoom = zoom;
control.scale = scale;
control.attribution = attribution;

/*
	L.Handler is a base class for handler classes that are used internally to inject
	interaction features like dragging to classes like Map and Marker.
*/

// @class Handler
// @aka L.Handler
// Abstract class for map interaction handlers

var Handler = Class.extend({
	initialize: function (map) {
		this._map = map;
	},

	// @method enable(): this
	// Enables the handler
	enable: function () {
		if (this._enabled) { return this; }

		this._enabled = true;
		this.addHooks();
		return this;
	},

	// @method disable(): this
	// Disables the handler
	disable: function () {
		if (!this._enabled) { return this; }

		this._enabled = false;
		this.removeHooks();
		return this;
	},

	// @method enabled(): Boolean
	// Returns `true` if the handler is enabled
	enabled: function () {
		return !!this._enabled;
	}

	// @section Extension methods
	// Classes inheriting from `Handler` must implement the two following methods:
	// @method addHooks()
	// Called when the handler is enabled, should add event hooks.
	// @method removeHooks()
	// Called when the handler is disabled, should remove the event hooks added previously.
});

// @section There is static function which can be called without instantiating L.Handler:
// @function addTo(map: Map, name: String): this
// Adds a new Handler to the given map with the given name.
Handler.addTo = function (map, name) {
	map.addHandler(name, this);
	return this;
};

var Mixin = {Events: Events};

/*
 * @class Draggable
 * @aka L.Draggable
 * @inherits Evented
 *
 * A class for making DOM elements draggable (including touch support).
 * Used internally for map and marker dragging. Only works for elements
 * that were positioned with [`L.DomUtil.setPosition`](#domutil-setposition).
 *
 * @example
 * ```js
 * var draggable = new L.Draggable(elementToDrag);
 * draggable.enable();
 * ```
 */

var START = touch ? 'touchstart mousedown' : 'mousedown';
var END = {
	mousedown: 'mouseup',
	touchstart: 'touchend',
	pointerdown: 'touchend',
	MSPointerDown: 'touchend'
};
var MOVE = {
	mousedown: 'mousemove',
	touchstart: 'touchmove',
	pointerdown: 'touchmove',
	MSPointerDown: 'touchmove'
};


var Draggable = Evented.extend({

	options: {
		// @section
		// @aka Draggable options
		// @option clickTolerance: Number = 3
		// The max number of pixels a user can shift the mouse pointer during a click
		// for it to be considered a valid click (as opposed to a mouse drag).
		clickTolerance: 3
	},

	// @constructor L.Draggable(el: HTMLElement, dragHandle?: HTMLElement, preventOutline?: Boolean, options?: Draggable options)
	// Creates a `Draggable` object for moving `el` when you start dragging the `dragHandle` element (equals `el` itself by default).
	initialize: function (element, dragStartTarget, preventOutline$$1, options) {
		setOptions(this, options);

		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
		this._preventOutline = preventOutline$$1;
	},

	// @method enable()
	// Enables the dragging ability
	enable: function () {
		if (this._enabled) { return; }

		on(this._dragStartTarget, START, this._onDown, this);

		this._enabled = true;
	},

	// @method disable()
	// Disables the dragging ability
	disable: function () {
		if (!this._enabled) { return; }

		// If we're currently dragging this draggable,
		// disabling it counts as first ending the drag.
		if (Draggable._dragging === this) {
			this.finishDrag();
		}

		off(this._dragStartTarget, START, this._onDown, this);

		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }

		this._moved = false;

		if (hasClass(this._element, 'leaflet-zoom-anim')) { return; }

		if (Draggable._dragging || e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }
		Draggable._dragging = this;  // Prevent dragging multiple objects at once.

		if (this._preventOutline) {
			preventOutline(this._element);
		}

		disableImageDrag();
		disableTextSelection();

		if (this._moving) { return; }

		// @event down: Event
		// Fired when a drag is about to start.
		this.fire('down');

		var first = e.touches ? e.touches[0] : e;

		this._startPoint = new Point(first.clientX, first.clientY);

		on(document, MOVE[e.type], this._onMove, this);
		on(document, END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }

		if (e.touches && e.touches.length > 1) {
			this._moved = true;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }
		if (Math.abs(offset.x) + Math.abs(offset.y) < this.options.clickTolerance) { return; }

		preventDefault(e);

		if (!this._moved) {
			// @event dragstart: Event
			// Fired when a drag starts
			this.fire('dragstart');

			this._moved = true;
			this._startPos = getPosition(this._element).subtract(offset);

			addClass(document.body, 'leaflet-dragging');

			this._lastTarget = e.target || e.srcElement;
			// IE and Edge do not give the <use> element, so fetch it
			// if necessary
			if ((window.SVGElementInstance) && (this._lastTarget instanceof SVGElementInstance)) {
				this._lastTarget = this._lastTarget.correspondingUseElement;
			}
			addClass(this._lastTarget, 'leaflet-drag-target');
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		cancelAnimFrame(this._animRequest);
		this._lastEvent = e;
		this._animRequest = requestAnimFrame(this._updatePosition, this, true);
	},

	_updatePosition: function () {
		var e = {originalEvent: this._lastEvent};

		// @event predrag: Event
		// Fired continuously during dragging *before* each corresponding
		// update of the element's position.
		this.fire('predrag', e);
		setPosition(this._element, this._newPos);

		// @event drag: Event
		// Fired continuously during dragging.
		this.fire('drag', e);
	},

	_onUp: function (e) {
		// Ignore simulated events, since we handle both touch and
		// mouse explicitly; otherwise we risk getting duplicates of
		// touch events, see #4315.
		// Also ignore the event if disabled; this happens in IE11
		// under some circumstances, see #3666.
		if (e._simulated || !this._enabled) { return; }
		this.finishDrag();
	},

	finishDrag: function () {
		removeClass(document.body, 'leaflet-dragging');

		if (this._lastTarget) {
			removeClass(this._lastTarget, 'leaflet-drag-target');
			this._lastTarget = null;
		}

		for (var i in MOVE) {
			off(document, MOVE[i], this._onMove, this);
			off(document, END[i], this._onUp, this);
		}

		enableImageDrag();
		enableTextSelection();

		if (this._moved && this._moving) {
			// ensure drag is not fired after dragend
			cancelAnimFrame(this._animRequest);

			// @event dragend: DragEndEvent
			// Fired when the drag ends.
			this.fire('dragend', {
				distance: this._newPos.distanceTo(this._startPos)
			});
		}

		this._moving = false;
		Draggable._dragging = false;
	}

});

/*
 * @namespace LineUtil
 *
 * Various utility functions for polyline points processing, used by Leaflet internally to make polylines lightning-fast.
 */

// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
// Improves rendering performance dramatically by lessening the number of points to draw.

// @function simplify(points: Point[], tolerance: Number): Point[]
// Dramatically reduces the number of points in a polyline while retaining
// its shape and returns a new array of simplified points, using the
// [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
// Used for a huge performance boost when processing/displaying Leaflet polylines for
// each zoom level and also reducing visual noise. tolerance affects the amount of
// simplification (lesser value means higher quality but slower and with more points).
// Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
function simplify(points, tolerance) {
	if (!tolerance || !points.length) {
		return points.slice();
	}

	var sqTolerance = tolerance * tolerance;

	    // stage 1: vertex reduction
	    points = _reducePoints(points, sqTolerance);

	    // stage 2: Douglas-Peucker simplification
	    points = _simplifyDP(points, sqTolerance);

	return points;
}

// @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
// Returns the distance between point `p` and segment `p1` to `p2`.
function pointToSegmentDistance(p, p1, p2) {
	return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
}

// @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
// Returns the closest point from a point `p` on a segment `p1` to `p2`.
function closestPointOnSegment(p, p1, p2) {
	return _sqClosestPointOnSegment(p, p1, p2);
}

// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
function _simplifyDP(points, sqTolerance) {

	var len = points.length,
	    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
	    markers = new ArrayConstructor(len);

	    markers[0] = markers[len - 1] = 1;

	_simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

	var i,
	    newPoints = [];

	for (i = 0; i < len; i++) {
		if (markers[i]) {
			newPoints.push(points[i]);
		}
	}

	return newPoints;
}

function _simplifyDPStep(points, markers, sqTolerance, first, last) {

	var maxSqDist = 0,
	index, i, sqDist;

	for (i = first + 1; i <= last - 1; i++) {
		sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

		if (sqDist > maxSqDist) {
			index = i;
			maxSqDist = sqDist;
		}
	}

	if (maxSqDist > sqTolerance) {
		markers[index] = 1;

		_simplifyDPStep(points, markers, sqTolerance, first, index);
		_simplifyDPStep(points, markers, sqTolerance, index, last);
	}
}

// reduce points that are too close to each other to a single point
function _reducePoints(points, sqTolerance) {
	var reducedPoints = [points[0]];

	for (var i = 1, prev = 0, len = points.length; i < len; i++) {
		if (_sqDist(points[i], points[prev]) > sqTolerance) {
			reducedPoints.push(points[i]);
			prev = i;
		}
	}
	if (prev < len - 1) {
		reducedPoints.push(points[len - 1]);
	}
	return reducedPoints;
}

var _lastCode;

// @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
// Clips the segment a to b by rectangular bounds with the
// [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
// (modifying the segment points directly!). Used by Leaflet to only show polyline
// points that are on the screen or near, increasing performance.
function clipSegment(a, b, bounds, useLastCode, round) {
	var codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
	    codeB = _getBitCode(b, bounds),

	    codeOut, p, newCode;

	    // save 2nd code to avoid calculating it on the next segment
	    _lastCode = codeB;

	while (true) {
		// if a,b is inside the clip window (trivial accept)
		if (!(codeA | codeB)) {
			return [a, b];
		}

		// if a,b is outside the clip window (trivial reject)
		if (codeA & codeB) {
			return false;
		}

		// other cases
		codeOut = codeA || codeB;
		p = _getEdgeIntersection(a, b, codeOut, bounds, round);
		newCode = _getBitCode(p, bounds);

		if (codeOut === codeA) {
			a = p;
			codeA = newCode;
		} else {
			b = p;
			codeB = newCode;
		}
	}
}

function _getEdgeIntersection(a, b, code, bounds, round) {
	var dx = b.x - a.x,
	    dy = b.y - a.y,
	    min = bounds.min,
	    max = bounds.max,
	    x, y;

	if (code & 8) { // top
		x = a.x + dx * (max.y - a.y) / dy;
		y = max.y;

	} else if (code & 4) { // bottom
		x = a.x + dx * (min.y - a.y) / dy;
		y = min.y;

	} else if (code & 2) { // right
		x = max.x;
		y = a.y + dy * (max.x - a.x) / dx;

	} else if (code & 1) { // left
		x = min.x;
		y = a.y + dy * (min.x - a.x) / dx;
	}

	return new Point(x, y, round);
}

function _getBitCode(p, bounds) {
	var code = 0;

	if (p.x < bounds.min.x) { // left
		code |= 1;
	} else if (p.x > bounds.max.x) { // right
		code |= 2;
	}

	if (p.y < bounds.min.y) { // bottom
		code |= 4;
	} else if (p.y > bounds.max.y) { // top
		code |= 8;
	}

	return code;
}

// square distance (to avoid unnecessary Math.sqrt calls)
function _sqDist(p1, p2) {
	var dx = p2.x - p1.x,
	    dy = p2.y - p1.y;
	return dx * dx + dy * dy;
}

// return closest point on segment or distance to that point
function _sqClosestPointOnSegment(p, p1, p2, sqDist) {
	var x = p1.x,
	    y = p1.y,
	    dx = p2.x - x,
	    dy = p2.y - y,
	    dot = dx * dx + dy * dy,
	    t;

	if (dot > 0) {
		t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

		if (t > 1) {
			x = p2.x;
			y = p2.y;
		} else if (t > 0) {
			x += dx * t;
			y += dy * t;
		}
	}

	dx = p.x - x;
	dy = p.y - y;

	return sqDist ? dx * dx + dy * dy : new Point(x, y);
}


// @function isFlat(latlngs: LatLng[]): Boolean
// Returns true if `latlngs` is a flat array, false is nested.
function isFlat(latlngs) {
	return !isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
}

function _flat(latlngs) {
	console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
	return isFlat(latlngs);
}


var LineUtil = (Object.freeze || Object)({
	simplify: simplify,
	pointToSegmentDistance: pointToSegmentDistance,
	closestPointOnSegment: closestPointOnSegment,
	clipSegment: clipSegment,
	_getEdgeIntersection: _getEdgeIntersection,
	_getBitCode: _getBitCode,
	_sqClosestPointOnSegment: _sqClosestPointOnSegment,
	isFlat: isFlat,
	_flat: _flat
});

/*
 * @namespace PolyUtil
 * Various utility functions for polygon geometries.
 */

/* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
 * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
 * Used by Leaflet to only show polygon points that are on the screen or near, increasing
 * performance. Note that polygon points needs different algorithm for clipping
 * than polyline, so there's a separate method for it.
 */
function clipPolygon(points, bounds, round) {
	var clippedPoints,
	    edges = [1, 4, 2, 8],
	    i, j, k,
	    a, b,
	    len, edge, p;

	for (i = 0, len = points.length; i < len; i++) {
		points[i]._code = _getBitCode(points[i], bounds);
	}

	// for each edge (left, bottom, right, top)
	for (k = 0; k < 4; k++) {
		edge = edges[k];
		clippedPoints = [];

		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
			a = points[i];
			b = points[j];

			// if a is inside the clip window
			if (!(a._code & edge)) {
				// if b is outside the clip window (a->b goes out of screen)
				if (b._code & edge) {
					p = _getEdgeIntersection(b, a, edge, bounds, round);
					p._code = _getBitCode(p, bounds);
					clippedPoints.push(p);
				}
				clippedPoints.push(a);

			// else if b is inside the clip window (a->b enters the screen)
			} else if (!(b._code & edge)) {
				p = _getEdgeIntersection(b, a, edge, bounds, round);
				p._code = _getBitCode(p, bounds);
				clippedPoints.push(p);
			}
		}
		points = clippedPoints;
	}

	return points;
}


var PolyUtil = (Object.freeze || Object)({
	clipPolygon: clipPolygon
});

/*
 * @namespace Projection
 * @section
 * Leaflet comes with a set of already defined Projections out of the box:
 *
 * @projection L.Projection.LonLat
 *
 * Equirectangular, or Plate Carree projection — the most simple projection,
 * mostly used by GIS enthusiasts. Directly maps `x` as longitude, and `y` as
 * latitude. Also suitable for flat worlds, e.g. game maps. Used by the
 * `EPSG:4326` and `Simple` CRS.
 */

var LonLat = {
	project: function (latlng) {
		return new Point(latlng.lng, latlng.lat);
	},

	unproject: function (point) {
		return new LatLng(point.y, point.x);
	},

	bounds: new Bounds([-180, -90], [180, 90])
};

/*
 * @namespace Projection
 * @projection L.Projection.Mercator
 *
 * Elliptical Mercator projection — more complex than Spherical Mercator. Takes into account that Earth is a geoid, not a perfect sphere. Used by the EPSG:3395 CRS.
 */

var Mercator = {
	R: 6378137,
	R_MINOR: 6356752.314245179,

	bounds: new Bounds([-20037508.34279, -15496570.73972], [20037508.34279, 18764656.23138]),

	project: function (latlng) {
		var d = Math.PI / 180,
		    r = this.R,
		    y = latlng.lat * d,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    con = e * Math.sin(y);

		var ts = Math.tan(Math.PI / 4 - y / 2) / Math.pow((1 - con) / (1 + con), e / 2);
		y = -r * Math.log(Math.max(ts, 1E-10));

		return new Point(latlng.lng * d * r, y);
	},

	unproject: function (point) {
		var d = 180 / Math.PI,
		    r = this.R,
		    tmp = this.R_MINOR / r,
		    e = Math.sqrt(1 - tmp * tmp),
		    ts = Math.exp(-point.y / r),
		    phi = Math.PI / 2 - 2 * Math.atan(ts);

		for (var i = 0, dphi = 0.1, con; i < 15 && Math.abs(dphi) > 1e-7; i++) {
			con = e * Math.sin(phi);
			con = Math.pow((1 - con) / (1 + con), e / 2);
			dphi = Math.PI / 2 - 2 * Math.atan(ts * con) - phi;
			phi += dphi;
		}

		return new LatLng(phi * d, point.x * d / r);
	}
};

/*
 * @class Projection

 * An object with methods for projecting geographical coordinates of the world onto
 * a flat surface (and back). See [Map projection](http://en.wikipedia.org/wiki/Map_projection).

 * @property bounds: Bounds
 * The bounds (specified in CRS units) where the projection is valid

 * @method project(latlng: LatLng): Point
 * Projects geographical coordinates into a 2D point.
 * Only accepts actual `L.LatLng` instances, not arrays.

 * @method unproject(point: Point): LatLng
 * The inverse of `project`. Projects a 2D point into a geographical location.
 * Only accepts actual `L.Point` instances, not arrays.

 * Note that the projection instances do not inherit from Leafet's `Class` object,
 * and can't be instantiated. Also, new classes can't inherit from them,
 * and methods can't be added to them with the `include` function.

 */




var index = (Object.freeze || Object)({
	LonLat: LonLat,
	Mercator: Mercator,
	SphericalMercator: SphericalMercator
});

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3395
 *
 * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
 */
var EPSG3395 = extend({}, Earth, {
	code: 'EPSG:3395',
	projection: Mercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * Mercator.R);
		return toTransformation(scale, 0.5, -scale, 0.5);
	}())
});

/*
 * @namespace CRS
 * @crs L.CRS.EPSG4326
 *
 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
 *
 * Leaflet 1.0.x complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic),
 * which is a breaking change from 0.7.x behaviour.  If you are using a `TileLayer`
 * with this CRS, ensure that there are two 256x256 pixel tiles covering the
 * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
 * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
 */

var EPSG4326 = extend({}, Earth, {
	code: 'EPSG:4326',
	projection: LonLat,
	transformation: toTransformation(1 / 180, 1, -1 / 180, 0.5)
});

/*
 * @namespace CRS
 * @crs L.CRS.Simple
 *
 * A simple CRS that maps longitude and latitude into `x` and `y` directly.
 * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
 * axis should still be inverted (going from bottom to top). `distance()` returns
 * simple euclidean distance.
 */

var Simple = extend({}, CRS, {
	projection: LonLat,
	transformation: toTransformation(1, 0, -1, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	},

	zoom: function (scale) {
		return Math.log(scale) / Math.LN2;
	},

	distance: function (latlng1, latlng2) {
		var dx = latlng2.lng - latlng1.lng,
		    dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	},

	infinite: true
});

CRS.Earth = Earth;
CRS.EPSG3395 = EPSG3395;
CRS.EPSG3857 = EPSG3857;
CRS.EPSG900913 = EPSG900913;
CRS.EPSG4326 = EPSG4326;
CRS.Simple = Simple;

/*
 * @class Layer
 * @inherits Evented
 * @aka L.Layer
 * @aka ILayer
 *
 * A set of methods from the Layer base class that all Leaflet layers use.
 * Inherits all methods, options and events from `L.Evented`.
 *
 * @example
 *
 * ```js
 * var layer = L.Marker(latlng).addTo(map);
 * layer.addTo(map);
 * layer.remove();
 * ```
 *
 * @event add: Event
 * Fired after the layer is added to a map
 *
 * @event remove: Event
 * Fired after the layer is removed from a map
 */


var Layer = Evented.extend({

	// Classes extending `L.Layer` will inherit the following options:
	options: {
		// @option pane: String = 'overlayPane'
		// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
		pane: 'overlayPane',

		// @option attribution: String = null
		// String to be shown in the attribution control, describes the layer data, e.g. "© Mapbox".
		attribution: null,

		bubblingMouseEvents: true
	},

	/* @section
	 * Classes extending `L.Layer` will inherit the following methods:
	 *
	 * @method addTo(map: Map|LayerGroup): this
	 * Adds the layer to the given map or layer group.
	 */
	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	// @method remove: this
	// Removes the layer from the map it is currently active on.
	remove: function () {
		return this.removeFrom(this._map || this._mapToAdd);
	},

	// @method removeFrom(map: Map): this
	// Removes the layer from the given map
	removeFrom: function (obj) {
		if (obj) {
			obj.removeLayer(this);
		}
		return this;
	},

	// @method getPane(name? : String): HTMLElement
	// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
	getPane: function (name) {
		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
	},

	addInteractiveTarget: function (targetEl) {
		this._map._targets[stamp(targetEl)] = this;
		return this;
	},

	removeInteractiveTarget: function (targetEl) {
		delete this._map._targets[stamp(targetEl)];
		return this;
	},

	// @method getAttribution: String
	// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
	getAttribution: function () {
		return this.options.attribution;
	},

	_layerAdd: function (e) {
		var map = e.target;

		// check in case layer gets added and then removed before the map is ready
		if (!map.hasLayer(this)) { return; }

		this._map = map;
		this._zoomAnimated = map._zoomAnimated;

		if (this.getEvents) {
			var events = this.getEvents();
			map.on(events, this);
			this.once('remove', function () {
				map.off(events, this);
			}, this);
		}

		this.onAdd(map);

		if (this.getAttribution && map.attributionControl) {
			map.attributionControl.addAttribution(this.getAttribution());
		}

		this.fire('add');
		map.fire('layeradd', {layer: this});
	}
});

/* @section Extension methods
 * @uninheritable
 *
 * Every layer should extend from `L.Layer` and (re-)implement the following methods.
 *
 * @method onAdd(map: Map): this
 * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
 *
 * @method onRemove(map: Map): this
 * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
 *
 * @method getEvents(): Object
 * This optional method should return an object like `{ viewreset: this._reset }` for [`addEventListener`](#evented-addeventlistener). The event handlers in this object will be automatically added and removed from the map with your layer.
 *
 * @method getAttribution(): String
 * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
 *
 * @method beforeAdd(map: Map): this
 * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
 */


/* @namespace Map
 * @section Layer events
 *
 * @event layeradd: LayerEvent
 * Fired when a new layer is added to the map.
 *
 * @event layerremove: LayerEvent
 * Fired when some layer is removed from the map
 *
 * @section Methods for Layers and Controls
 */
Map.include({
	// @method addLayer(layer: Layer): this
	// Adds the given layer to the map
	addLayer: function (layer) {
		if (!layer._layerAdd) {
			throw new Error('The provided object is not a Layer.');
		}

		var id = stamp(layer);
		if (this._layers[id]) { return this; }
		this._layers[id] = layer;

		layer._mapToAdd = this;

		if (layer.beforeAdd) {
			layer.beforeAdd(this);
		}

		this.whenReady(layer._layerAdd, layer);

		return this;
	},

	// @method removeLayer(layer: Layer): this
	// Removes the given layer from the map.
	removeLayer: function (layer) {
		var id = stamp(layer);

		if (!this._layers[id]) { return this; }

		if (this._loaded) {
			layer.onRemove(this);
		}

		if (layer.getAttribution && this.attributionControl) {
			this.attributionControl.removeAttribution(layer.getAttribution());
		}

		delete this._layers[id];

		if (this._loaded) {
			this.fire('layerremove', {layer: layer});
			layer.fire('remove');
		}

		layer._map = layer._mapToAdd = null;

		return this;
	},

	// @method hasLayer(layer: Layer): Boolean
	// Returns `true` if the given layer is currently added to the map
	hasLayer: function (layer) {
		return !!layer && (stamp(layer) in this._layers);
	},

	/* @method eachLayer(fn: Function, context?: Object): this
	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	 * ```
	 * map.eachLayer(function(layer){
	 *     layer.bindPopup('Hello');
	 * });
	 * ```
	 */
	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	_addLayers: function (layers) {
		layers = layers ? (isArray(layers) ? layers : [layers]) : [];

		for (var i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},

	_addZoomLimit: function (layer) {
		if (isNaN(layer.options.maxZoom) || !isNaN(layer.options.minZoom)) {
			this._zoomBoundLayers[stamp(layer)] = layer;
			this._updateZoomLevels();
		}
	},

	_removeZoomLimit: function (layer) {
		var id = stamp(layer);

		if (this._zoomBoundLayers[id]) {
			delete this._zoomBoundLayers[id];
			this._updateZoomLevels();
		}
	},

	_updateZoomLevels: function () {
		var minZoom = Infinity,
		    maxZoom = -Infinity,
		    oldZoomSpan = this._getZoomSpan();

		for (var i in this._zoomBoundLayers) {
			var options = this._zoomBoundLayers[i].options;

			minZoom = options.minZoom === undefined ? minZoom : Math.min(minZoom, options.minZoom);
			maxZoom = options.maxZoom === undefined ? maxZoom : Math.max(maxZoom, options.maxZoom);
		}

		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

		// @section Map state change events
		// @event zoomlevelschange: Event
		// Fired when the number of zoomlevels on the map is changed due
		// to adding or removing a layer.
		if (oldZoomSpan !== this._getZoomSpan()) {
			this.fire('zoomlevelschange');
		}

		if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
			this.setZoom(this._layersMaxZoom);
		}
		if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
			this.setZoom(this._layersMinZoom);
		}
	}
});

/*
 * @class LayerGroup
 * @aka L.LayerGroup
 * @inherits Layer
 *
 * Used to group several layers and handle them as one. If you add it to the map,
 * any layers added or removed from the group will be added/removed on the map as
 * well. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * L.layerGroup([marker1, marker2])
 * 	.addLayer(polyline)
 * 	.addTo(map);
 * ```
 */

var LayerGroup = Layer.extend({

	initialize: function (layers, options) {
		setOptions(this, options);

		this._layers = {};

		var i, len;

		if (layers) {
			for (i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	// @method addLayer(layer: Layer): this
	// Adds the given layer to the group.
	addLayer: function (layer) {
		var id = this.getLayerId(layer);

		this._layers[id] = layer;

		if (this._map) {
			this._map.addLayer(layer);
		}

		return this;
	},

	// @method removeLayer(layer: Layer): this
	// Removes the given layer from the group.
	// @alternative
	// @method removeLayer(id: Number): this
	// Removes the layer with the given internal ID from the group.
	removeLayer: function (layer) {
		var id = layer in this._layers ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	},

	// @method hasLayer(layer: Layer): Boolean
	// Returns `true` if the given layer is currently added to the group.
	// @alternative
	// @method hasLayer(id: Number): Boolean
	// Returns `true` if the given internal ID is currently added to the group.
	hasLayer: function (layer) {
		return !!layer && (layer in this._layers || this.getLayerId(layer) in this._layers);
	},

	// @method clearLayers(): this
	// Removes all the layers from the group.
	clearLayers: function () {
		return this.eachLayer(this.removeLayer, this);
	},

	// @method invoke(methodName: String, …): this
	// Calls `methodName` on every layer contained in this group, passing any
	// additional parameters. Has no effect if the layers contained do not
	// implement `methodName`.
	invoke: function (methodName) {
		var args = Array.prototype.slice.call(arguments, 1),
		    i, layer;

		for (i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd: function (map) {
		this.eachLayer(map.addLayer, map);
	},

	onRemove: function (map) {
		this.eachLayer(map.removeLayer, map);
	},

	// @method eachLayer(fn: Function, context?: Object): this
	// Iterates over the layers of the group, optionally specifying context of the iterator function.
	// ```js
	// group.eachLayer(function (layer) {
	// 	layer.bindPopup('Hello');
	// });
	// ```
	eachLayer: function (method, context) {
		for (var i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	// @method getLayer(id: Number): Layer
	// Returns the layer with the given internal ID.
	getLayer: function (id) {
		return this._layers[id];
	},

	// @method getLayers(): Layer[]
	// Returns an array of all the layers added to the group.
	getLayers: function () {
		var layers = [];
		this.eachLayer(layers.push, layers);
		return layers;
	},

	// @method setZIndex(zIndex: Number): this
	// Calls `setZIndex` on every layer contained in this group, passing the z-index.
	setZIndex: function (zIndex) {
		return this.invoke('setZIndex', zIndex);
	},

	// @method getLayerId(layer: Layer): Number
	// Returns the internal ID for a layer
	getLayerId: function (layer) {
		return stamp(layer);
	}
});


// @factory L.layerGroup(layers?: Layer[], options?: Object)
// Create a layer group, optionally given an initial set of layers and an `options` object.
var layerGroup = function (layers, options) {
	return new LayerGroup(layers, options);
};

/*
 * @class FeatureGroup
 * @aka L.FeatureGroup
 * @inherits LayerGroup
 *
 * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
 *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
 *  * Events are propagated to the `FeatureGroup`, so if the group has an event
 * handler, it will handle events from any of the layers. This includes mouse events
 * and custom events.
 *  * Has `layeradd` and `layerremove` events
 *
 * @example
 *
 * ```js
 * L.featureGroup([marker1, marker2, polyline])
 * 	.bindPopup('Hello world!')
 * 	.on('click', function() { alert('Clicked on a member of the group!'); })
 * 	.addTo(map);
 * ```
 */

var FeatureGroup = LayerGroup.extend({

	addLayer: function (layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		layer.addEventParent(this);

		LayerGroup.prototype.addLayer.call(this, layer);

		// @event layeradd: LayerEvent
		// Fired when a layer is added to this `FeatureGroup`
		return this.fire('layeradd', {layer: layer});
	},

	removeLayer: function (layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.removeEventParent(this);

		LayerGroup.prototype.removeLayer.call(this, layer);

		// @event layerremove: LayerEvent
		// Fired when a layer is removed from this `FeatureGroup`
		return this.fire('layerremove', {layer: layer});
	},

	// @method setStyle(style: Path options): this
	// Sets the given path options to each layer of the group that has a `setStyle` method.
	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	// @method bringToFront(): this
	// Brings the layer group to the top of all other layers
	bringToFront: function () {
		return this.invoke('bringToFront');
	},

	// @method bringToBack(): this
	// Brings the layer group to the back of all other layers
	bringToBack: function () {
		return this.invoke('bringToBack');
	},

	// @method getBounds(): LatLngBounds
	// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
	getBounds: function () {
		var bounds = new LatLngBounds();

		for (var id in this._layers) {
			var layer = this._layers[id];
			bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
		}
		return bounds;
	}
});

// @factory L.featureGroup(layers: Layer[])
// Create a feature group, optionally given an initial set of layers.
var featureGroup = function (layers) {
	return new FeatureGroup(layers);
};

/*
 * @class Icon
 * @aka L.Icon
 *
 * Represents an icon to provide when creating a marker.
 *
 * @example
 *
 * ```js
 * var myIcon = L.icon({
 *     iconUrl: 'my-icon.png',
 *     iconRetinaUrl: 'my-icon@2x.png',
 *     iconSize: [38, 95],
 *     iconAnchor: [22, 94],
 *     popupAnchor: [-3, -76],
 *     shadowUrl: 'my-icon-shadow.png',
 *     shadowRetinaUrl: 'my-icon-shadow@2x.png',
 *     shadowSize: [68, 95],
 *     shadowAnchor: [22, 94]
 * });
 *
 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
 * ```
 *
 * `L.Icon.Default` extends `L.Icon` and is the blue icon Leaflet uses for markers by default.
 *
 */

var Icon = Class.extend({

	/* @section
	 * @aka Icon options
	 *
	 * @option iconUrl: String = null
	 * **(required)** The URL to the icon image (absolute or relative to your script path).
	 *
	 * @option iconRetinaUrl: String = null
	 * The URL to a retina sized version of the icon image (absolute or relative to your
	 * script path). Used for Retina screen devices.
	 *
	 * @option iconSize: Point = null
	 * Size of the icon image in pixels.
	 *
	 * @option iconAnchor: Point = null
	 * The coordinates of the "tip" of the icon (relative to its top left corner). The icon
	 * will be aligned so that this point is at the marker's geographical location. Centered
	 * by default if size is specified, also can be set in CSS with negative margins.
	 *
	 * @option popupAnchor: Point = [0, 0]
	 * The coordinates of the point from which popups will "open", relative to the icon anchor.
	 *
	 * @option tooltipAnchor: Point = [0, 0]
	 * The coordinates of the point from which tooltips will "open", relative to the icon anchor.
	 *
	 * @option shadowUrl: String = null
	 * The URL to the icon shadow image. If not specified, no shadow image will be created.
	 *
	 * @option shadowRetinaUrl: String = null
	 *
	 * @option shadowSize: Point = null
	 * Size of the shadow image in pixels.
	 *
	 * @option shadowAnchor: Point = null
	 * The coordinates of the "tip" of the shadow (relative to its top left corner) (the same
	 * as iconAnchor if not specified).
	 *
	 * @option className: String = ''
	 * A custom class name to assign to both icon and shadow images. Empty by default.
	 */

	options: {
		popupAnchor: [0, 0],
		tooltipAnchor: [0, 0],
	},

	initialize: function (options) {
		setOptions(this, options);
	},

	// @method createIcon(oldIcon?: HTMLElement): HTMLElement
	// Called internally when the icon has to be shown, returns a `<img>` HTML element
	// styled according to the options.
	createIcon: function (oldIcon) {
		return this._createIcon('icon', oldIcon);
	},

	// @method createShadow(oldIcon?: HTMLElement): HTMLElement
	// As `createIcon`, but for the shadow beneath it.
	createShadow: function (oldIcon) {
		return this._createIcon('shadow', oldIcon);
	},

	_createIcon: function (name, oldIcon) {
		var src = this._getIconUrl(name);

		if (!src) {
			if (name === 'icon') {
				throw new Error('iconUrl not set in Icon options (see the docs).');
			}
			return null;
		}

		var img = this._createImg(src, oldIcon && oldIcon.tagName === 'IMG' ? oldIcon : null);
		this._setIconStyles(img, name);

		return img;
	},

	_setIconStyles: function (img, name) {
		var options = this.options;
		var sizeOption = options[name + 'Size'];

		if (typeof sizeOption === 'number') {
			sizeOption = [sizeOption, sizeOption];
		}

		var size = toPoint(sizeOption),
		    anchor = toPoint(name === 'shadow' && options.shadowAnchor || options.iconAnchor ||
		            size && size.divideBy(2, true));

		img.className = 'leaflet-marker-' + name + ' ' + (options.className || '');

		if (anchor) {
			img.style.marginLeft = (-anchor.x) + 'px';
			img.style.marginTop  = (-anchor.y) + 'px';
		}

		if (size) {
			img.style.width  = size.x + 'px';
			img.style.height = size.y + 'px';
		}
	},

	_createImg: function (src, el) {
		el = el || document.createElement('img');
		el.src = src;
		return el;
	},

	_getIconUrl: function (name) {
		return retina && this.options[name + 'RetinaUrl'] || this.options[name + 'Url'];
	}
});


// @factory L.icon(options: Icon options)
// Creates an icon instance with the given options.
function icon(options) {
	return new Icon(options);
}

/*
 * @miniclass Icon.Default (Icon)
 * @aka L.Icon.Default
 * @section
 *
 * A trivial subclass of `Icon`, represents the icon to use in `Marker`s when
 * no icon is specified. Points to the blue marker image distributed with Leaflet
 * releases.
 *
 * In order to customize the default icon, just change the properties of `L.Icon.Default.prototype.options`
 * (which is a set of `Icon options`).
 *
 * If you want to _completely_ replace the default icon, override the
 * `L.Marker.prototype.options.icon` with your own icon instead.
 */

var IconDefault = Icon.extend({

	options: {
		iconUrl:       'marker-icon.png',
		iconRetinaUrl: 'marker-icon-2x.png',
		shadowUrl:     'marker-shadow.png',
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	},

	_getIconUrl: function (name) {
		if (!IconDefault.imagePath) {	// Deprecated, backwards-compatibility only
			IconDefault.imagePath = this._detectIconPath();
		}

		// @option imagePath: String
		// `Icon.Default` will try to auto-detect the location of the
		// blue icon images. If you are placing these images in a non-standard
		// way, set this option to point to the right path.
		return (this.options.imagePath || IconDefault.imagePath) + Icon.prototype._getIconUrl.call(this, name);
	},

	_detectIconPath: function () {
		var el = create$1('div',  'leaflet-default-icon-path', document.body);
		var path = getStyle(el, 'background-image') ||
		           getStyle(el, 'backgroundImage');	// IE8

		document.body.removeChild(el);

		if (path === null || path.indexOf('url') !== 0) {
			path = '';
		} else {
			path = path.replace(/^url\(["']?/, '').replace(/marker-icon\.png["']?\)$/, '');
		}

		return path;
	}
});

/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */


/* @namespace Marker
 * @section Interaction handlers
 *
 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
 *
 * ```js
 * marker.dragging.disable();
 * ```
 *
 * @property dragging: Handler
 * Marker dragging handler (by both mouse and touch). Only valid when the marker is on the map (Otherwise set [`marker.options.draggable`](#marker-draggable)).
 */

var MarkerDrag = Handler.extend({
	initialize: function (marker) {
		this._marker = marker;
	},

	addHooks: function () {
		var icon = this._marker._icon;

		if (!this._draggable) {
			this._draggable = new Draggable(icon, icon, true);
		}

		this._draggable.on({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).enable();

		addClass(icon, 'leaflet-marker-draggable');
	},

	removeHooks: function () {
		this._draggable.off({
			dragstart: this._onDragStart,
			predrag: this._onPreDrag,
			drag: this._onDrag,
			dragend: this._onDragEnd
		}, this).disable();

		if (this._marker._icon) {
			removeClass(this._marker._icon, 'leaflet-marker-draggable');
		}
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	_adjustPan: function (e) {
		var marker = this._marker,
		    map = marker._map,
		    speed = this._marker.options.autoPanSpeed,
		    padding = this._marker.options.autoPanPadding,
		    iconPos = L.DomUtil.getPosition(marker._icon),
		    bounds = map.getPixelBounds(),
		    origin = map.getPixelOrigin();

		var panBounds = toBounds(
			bounds.min._subtract(origin).add(padding),
			bounds.max._subtract(origin).subtract(padding)
		);

		if (!panBounds.contains(iconPos)) {
			// Compute incremental movement
			var movement = toPoint(
				(Math.max(panBounds.max.x, iconPos.x) - panBounds.max.x) / (bounds.max.x - panBounds.max.x) -
				(Math.min(panBounds.min.x, iconPos.x) - panBounds.min.x) / (bounds.min.x - panBounds.min.x),

				(Math.max(panBounds.max.y, iconPos.y) - panBounds.max.y) / (bounds.max.y - panBounds.max.y) -
				(Math.min(panBounds.min.y, iconPos.y) - panBounds.min.y) / (bounds.min.y - panBounds.min.y)
			).multiplyBy(speed);

			map.panBy(movement, {animate: false});

			this._draggable._newPos._add(movement);
			this._draggable._startPos._add(movement);

			L.DomUtil.setPosition(marker._icon, this._draggable._newPos);
			this._onDrag(e);

			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
		}
	},

	_onDragStart: function () {
		// @section Dragging events
		// @event dragstart: Event
		// Fired when the user starts dragging the marker.

		// @event movestart: Event
		// Fired when the marker starts moving (because of dragging).

		this._oldLatLng = this._marker.getLatLng();
		this._marker
		    .closePopup()
		    .fire('movestart')
		    .fire('dragstart');
	},

	_onPreDrag: function (e) {
		if (this._marker.options.autoPan) {
			cancelAnimFrame(this._panRequest);
			this._panRequest = requestAnimFrame(this._adjustPan.bind(this, e));
		}
	},

	_onDrag: function (e) {
		var marker = this._marker,
		    shadow = marker._shadow,
		iconPos = getPosition(marker._icon),
		    latlng = marker._map.layerPointToLatLng(iconPos);

		// update shadow position
		if (shadow) {
			setPosition(shadow, iconPos);
		}

		marker._latlng = latlng;
		e.latlng = latlng;
		e.oldLatLng = this._oldLatLng;

		// @event drag: Event
		// Fired repeatedly while the user drags the marker.
		marker
		    .fire('move', e)
		    .fire('drag', e);
	},

	_onDragEnd: function (e) {
		// @event dragend: DragEndEvent
		// Fired when the user stops dragging the marker.

		 cancelAnimFrame(this._panRequest);

		// @event moveend: Event
		// Fired when the marker stops moving (because of dragging).
		delete this._oldLatLng;
		this._marker
		    .fire('moveend')
		    .fire('dragend', e);
	}
});

/*
 * @class Marker
 * @inherits Interactive layer
 * @aka L.Marker
 * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * L.marker([50.5, 30.5]).addTo(map);
 * ```
 */

var Marker = Layer.extend({

	// @section
	// @aka Marker options
	options: {
		// @option icon: Icon = *
		// Icon instance to use for rendering the marker.
		// See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
		// If not specified, a common instance of `L.Icon.Default` is used.
		icon: new IconDefault(),

		// Option inherited from "Interactive layer" abstract class
		interactive: true,

		// @option draggable: Boolean = false
		// Whether the marker is draggable with mouse/touch or not.
		draggable: false,

		// @option autoPan: Boolean = false
		// Set it to `true` if you want the map to do panning animation when marker hits the edges.
		autoPan: false,

		// @option autoPanPadding: Point = Point(50, 50)
		// Equivalent of setting both top left and bottom right autopan padding to the same value.
		autoPanPadding: [50, 50],

		// @option autoPanSpeed: Number = 10
		// Number of pixels the map should move by.
		autoPanSpeed: 10,

		// @option keyboard: Boolean = true
		// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
		keyboard: true,

		// @option title: String = ''
		// Text for the browser tooltip that appear on marker hover (no tooltip by default).
		title: '',

		// @option alt: String = ''
		// Text for the `alt` attribute of the icon image (useful for accessibility).
		alt: '',

		// @option zIndexOffset: Number = 0
		// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
		zIndexOffset: 0,

		// @option opacity: Number = 1.0
		// The opacity of the marker.
		opacity: 1,

		// @option riseOnHover: Boolean = false
		// If `true`, the marker will get on top of others when you hover the mouse over it.
		riseOnHover: false,

		// @option riseOffset: Number = 250
		// The z-index offset used for the `riseOnHover` feature.
		riseOffset: 250,

		// @option pane: String = 'markerPane'
		// `Map pane` where the markers icon will be added.
		pane: 'markerPane',

		// @option bubblingMouseEvents: Boolean = false
		// When `true`, a mouse event on this marker will trigger the same event on the map
		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
		bubblingMouseEvents: false
	},

	/* @section
	 *
	 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
	 */

	initialize: function (latlng, options) {
		setOptions(this, options);
		this._latlng = toLatLng(latlng);
	},

	onAdd: function (map) {
		this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

		if (this._zoomAnimated) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._initIcon();
		this.update();
	},

	onRemove: function (map) {
		if (this.dragging && this.dragging.enabled()) {
			this.options.draggable = true;
			this.dragging.removeHooks();
		}
		delete this.dragging;

		if (this._zoomAnimated) {
			map.off('zoomanim', this._animateZoom, this);
		}

		this._removeIcon();
		this._removeShadow();
	},

	getEvents: function () {
		return {
			zoom: this.update,
			viewreset: this.update
		};
	},

	// @method getLatLng: LatLng
	// Returns the current geographical position of the marker.
	getLatLng: function () {
		return this._latlng;
	},

	// @method setLatLng(latlng: LatLng): this
	// Changes the marker position to the given point.
	setLatLng: function (latlng) {
		var oldLatLng = this._latlng;
		this._latlng = toLatLng(latlng);
		this.update();

		// @event move: Event
		// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
		return this.fire('move', {oldLatLng: oldLatLng, latlng: this._latlng});
	},

	// @method setZIndexOffset(offset: Number): this
	// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
	setZIndexOffset: function (offset) {
		this.options.zIndexOffset = offset;
		return this.update();
	},

	// @method setIcon(icon: Icon): this
	// Changes the marker icon.
	setIcon: function (icon) {

		this.options.icon = icon;

		if (this._map) {
			this._initIcon();
			this.update();
		}

		if (this._popup) {
			this.bindPopup(this._popup, this._popup.options);
		}

		return this;
	},

	getElement: function () {
		return this._icon;
	},

	update: function () {

		if (this._icon && this._map) {
			var pos = this._map.latLngToLayerPoint(this._latlng).round();
			this._setPos(pos);
		}

		return this;
	},

	_initIcon: function () {
		var options = this.options,
		    classToAdd = 'leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		var icon = options.icon.createIcon(this._icon),
		    addIcon = false;

		// if we're not reusing the icon, remove the old one and init new one
		if (icon !== this._icon) {
			if (this._icon) {
				this._removeIcon();
			}
			addIcon = true;

			if (options.title) {
				icon.title = options.title;
			}

			if (icon.tagName === 'IMG') {
				icon.alt = options.alt || '';
			}
		}

		addClass(icon, classToAdd);

		if (options.keyboard) {
			icon.tabIndex = '0';
		}

		this._icon = icon;

		if (options.riseOnHover) {
			this.on({
				mouseover: this._bringToFront,
				mouseout: this._resetZIndex
			});
		}

		var newShadow = options.icon.createShadow(this._shadow),
		    addShadow = false;

		if (newShadow !== this._shadow) {
			this._removeShadow();
			addShadow = true;
		}

		if (newShadow) {
			addClass(newShadow, classToAdd);
			newShadow.alt = '';
		}
		this._shadow = newShadow;


		if (options.opacity < 1) {
			this._updateOpacity();
		}


		if (addIcon) {
			this.getPane().appendChild(this._icon);
		}
		this._initInteraction();
		if (newShadow && addShadow) {
			this.getPane('shadowPane').appendChild(this._shadow);
		}
	},

	_removeIcon: function () {
		if (this.options.riseOnHover) {
			this.off({
				mouseover: this._bringToFront,
				mouseout: this._resetZIndex
			});
		}

		remove(this._icon);
		this.removeInteractiveTarget(this._icon);

		this._icon = null;
	},

	_removeShadow: function () {
		if (this._shadow) {
			remove(this._shadow);
		}
		this._shadow = null;
	},

	_setPos: function (pos) {
		setPosition(this._icon, pos);

		if (this._shadow) {
			setPosition(this._shadow, pos);
		}

		this._zIndex = pos.y + this.options.zIndexOffset;

		this._resetZIndex();
	},

	_updateZIndex: function (offset) {
		this._icon.style.zIndex = this._zIndex + offset;
	},

	_animateZoom: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

		this._setPos(pos);
	},

	_initInteraction: function () {

		if (!this.options.interactive) { return; }

		addClass(this._icon, 'leaflet-interactive');

		this.addInteractiveTarget(this._icon);

		if (MarkerDrag) {
			var draggable = this.options.draggable;
			if (this.dragging) {
				draggable = this.dragging.enabled();
				this.dragging.disable();
			}

			this.dragging = new MarkerDrag(this);

			if (draggable) {
				this.dragging.enable();
			}
		}
	},

	// @method setOpacity(opacity: Number): this
	// Changes the opacity of the marker.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		if (this._map) {
			this._updateOpacity();
		}

		return this;
	},

	_updateOpacity: function () {
		var opacity = this.options.opacity;

		setOpacity(this._icon, opacity);

		if (this._shadow) {
			setOpacity(this._shadow, opacity);
		}
	},

	_bringToFront: function () {
		this._updateZIndex(this.options.riseOffset);
	},

	_resetZIndex: function () {
		this._updateZIndex(0);
	},

	_getPopupAnchor: function () {
		return this.options.icon.options.popupAnchor;
	},

	_getTooltipAnchor: function () {
		return this.options.icon.options.tooltipAnchor;
	}
});


// factory L.marker(latlng: LatLng, options? : Marker options)

// @factory L.marker(latlng: LatLng, options? : Marker options)
// Instantiates a Marker object given a geographical point and optionally an options object.
function marker(latlng, options) {
	return new Marker(latlng, options);
}

/*
 * @class Path
 * @aka L.Path
 * @inherits Interactive layer
 *
 * An abstract class that contains options and constants shared between vector
 * overlays (Polygon, Polyline, Circle). Do not use it directly. Extends `Layer`.
 */

var Path = Layer.extend({

	// @section
	// @aka Path options
	options: {
		// @option stroke: Boolean = true
		// Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles.
		stroke: true,

		// @option color: String = '#3388ff'
		// Stroke color
		color: '#3388ff',

		// @option weight: Number = 3
		// Stroke width in pixels
		weight: 3,

		// @option opacity: Number = 1.0
		// Stroke opacity
		opacity: 1,

		// @option lineCap: String= 'round'
		// A string that defines [shape to be used at the end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
		lineCap: 'round',

		// @option lineJoin: String = 'round'
		// A string that defines [shape to be used at the corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
		lineJoin: 'round',

		// @option dashArray: String = null
		// A string that defines the stroke [dash pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
		dashArray: null,

		// @option dashOffset: String = null
		// A string that defines the [distance into the dash pattern to start the dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset). Doesn't work on `Canvas`-powered layers in [some old browsers](https://developer.mozilla.org/docs/Web/API/CanvasRenderingContext2D/setLineDash#Browser_compatibility).
		dashOffset: null,

		// @option fill: Boolean = depends
		// Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles.
		fill: false,

		// @option fillColor: String = *
		// Fill color. Defaults to the value of the [`color`](#path-color) option
		fillColor: null,

		// @option fillOpacity: Number = 0.2
		// Fill opacity.
		fillOpacity: 0.2,

		// @option fillRule: String = 'evenodd'
		// A string that defines [how the inside of a shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
		fillRule: 'evenodd',

		// className: '',

		// Option inherited from "Interactive layer" abstract class
		interactive: true,

		// @option bubblingMouseEvents: Boolean = true
		// When `true`, a mouse event on this path will trigger the same event on the map
		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
		bubblingMouseEvents: true
	},

	beforeAdd: function (map) {
		// Renderer is set here because we need to call renderer.getEvents
		// before this.getEvents.
		this._renderer = map.getRenderer(this);
	},

	onAdd: function () {
		this._renderer._initPath(this);
		this._reset();
		this._renderer._addPath(this);
	},

	onRemove: function () {
		this._renderer._removePath(this);
	},

	// @method redraw(): this
	// Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
	redraw: function () {
		if (this._map) {
			this._renderer._updatePath(this);
		}
		return this;
	},

	// @method setStyle(style: Path options): this
	// Changes the appearance of a Path based on the options in the `Path options` object.
	setStyle: function (style) {
		setOptions(this, style);
		if (this._renderer) {
			this._renderer._updateStyle(this);
		}
		return this;
	},

	// @method bringToFront(): this
	// Brings the layer to the top of all path layers.
	bringToFront: function () {
		if (this._renderer) {
			this._renderer._bringToFront(this);
		}
		return this;
	},

	// @method bringToBack(): this
	// Brings the layer to the bottom of all path layers.
	bringToBack: function () {
		if (this._renderer) {
			this._renderer._bringToBack(this);
		}
		return this;
	},

	getElement: function () {
		return this._path;
	},

	_reset: function () {
		// defined in child classes
		this._project();
		this._update();
	},

	_clickTolerance: function () {
		// used when doing hit detection for Canvas layers
		return (this.options.stroke ? this.options.weight / 2 : 0) + this._renderer.options.tolerance;
	}
});

/*
 * @class CircleMarker
 * @aka L.CircleMarker
 * @inherits Path
 *
 * A circle of a fixed size with radius specified in pixels. Extends `Path`.
 */

var CircleMarker = Path.extend({

	// @section
	// @aka CircleMarker options
	options: {
		fill: true,

		// @option radius: Number = 10
		// Radius of the circle marker, in pixels
		radius: 10
	},

	initialize: function (latlng, options) {
		setOptions(this, options);
		this._latlng = toLatLng(latlng);
		this._radius = this.options.radius;
	},

	// @method setLatLng(latLng: LatLng): this
	// Sets the position of a circle marker to a new location.
	setLatLng: function (latlng) {
		this._latlng = toLatLng(latlng);
		this.redraw();
		return this.fire('move', {latlng: this._latlng});
	},

	// @method getLatLng(): LatLng
	// Returns the current geographical position of the circle marker
	getLatLng: function () {
		return this._latlng;
	},

	// @method setRadius(radius: Number): this
	// Sets the radius of a circle marker. Units are in pixels.
	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	// @method getRadius(): Number
	// Returns the current radius of the circle
	getRadius: function () {
		return this._radius;
	},

	setStyle : function (options) {
		var radius = options && options.radius || this._radius;
		Path.prototype.setStyle.call(this, options);
		this.setRadius(radius);
		return this;
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._updateBounds();
	},

	_updateBounds: function () {
		var r = this._radius,
		    r2 = this._radiusY || r,
		    w = this._clickTolerance(),
		    p = [r + w, r2 + w];
		this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
	},

	_update: function () {
		if (this._map) {
			this._updatePath();
		}
	},

	_updatePath: function () {
		this._renderer._updateCircle(this);
	},

	_empty: function () {
		return this._radius && !this._renderer._bounds.intersects(this._pxBounds);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p) {
		return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
	}
});


// @factory L.circleMarker(latlng: LatLng, options?: CircleMarker options)
// Instantiates a circle marker object given a geographical point, and an optional options object.
function circleMarker(latlng, options) {
	return new CircleMarker(latlng, options);
}

/*
 * @class Circle
 * @aka L.Circle
 * @inherits CircleMarker
 *
 * A class for drawing circle overlays on a map. Extends `CircleMarker`.
 *
 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
 *
 * @example
 *
 * ```js
 * L.circle([50.5, 30.5], {radius: 200}).addTo(map);
 * ```
 */

var Circle = CircleMarker.extend({

	initialize: function (latlng, options, legacyOptions) {
		if (typeof options === 'number') {
			// Backwards compatibility with 0.7.x factory (latlng, radius, options?)
			options = extend({}, legacyOptions, {radius: options});
		}
		setOptions(this, options);
		this._latlng = toLatLng(latlng);

		if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }

		// @section
		// @aka Circle options
		// @option radius: Number; Radius of the circle, in meters.
		this._mRadius = this.options.radius;
	},

	// @method setRadius(radius: Number): this
	// Sets the radius of a circle. Units are in meters.
	setRadius: function (radius) {
		this._mRadius = radius;
		return this.redraw();
	},

	// @method getRadius(): Number
	// Returns the current radius of a circle. Units are in meters.
	getRadius: function () {
		return this._mRadius;
	},

	// @method getBounds(): LatLngBounds
	// Returns the `LatLngBounds` of the path.
	getBounds: function () {
		var half = [this._radius, this._radiusY || this._radius];

		return new LatLngBounds(
			this._map.layerPointToLatLng(this._point.subtract(half)),
			this._map.layerPointToLatLng(this._point.add(half)));
	},

	setStyle: Path.prototype.setStyle,

	_project: function () {

		var lng = this._latlng.lng,
		    lat = this._latlng.lat,
		    map = this._map,
		    crs = map.options.crs;

		if (crs.distance === Earth.distance) {
			var d = Math.PI / 180,
			    latR = (this._mRadius / Earth.R) / d,
			    top = map.project([lat + latR, lng]),
			    bottom = map.project([lat - latR, lng]),
			    p = top.add(bottom).divideBy(2),
			    lat2 = map.unproject(p).lat,
			    lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
			            (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

			if (isNaN(lngR) || lngR === 0) {
				lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
			}

			this._point = p.subtract(map.getPixelOrigin());
			this._radius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
			this._radiusY = p.y - top.y;

		} else {
			var latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._mRadius, 0]));

			this._point = map.latLngToLayerPoint(this._latlng);
			this._radius = this._point.x - map.latLngToLayerPoint(latlng2).x;
		}

		this._updateBounds();
	}
});

// @factory L.circle(latlng: LatLng, options?: Circle options)
// Instantiates a circle object given a geographical point, and an options object
// which contains the circle radius.
// @alternative
// @factory L.circle(latlng: LatLng, radius: Number, options?: Circle options)
// Obsolete way of instantiating a circle, for compatibility with 0.7.x code.
// Do not use in new applications or plugins.
function circle(latlng, options, legacyOptions) {
	return new Circle(latlng, options, legacyOptions);
}

/*
 * @class Polyline
 * @aka L.Polyline
 * @inherits Path
 *
 * A class for drawing polyline overlays on a map. Extends `Path`.
 *
 * @example
 *
 * ```js
 * // create a red polyline from an array of LatLng points
 * var latlngs = [
 * 	[45.51, -122.68],
 * 	[37.77, -122.43],
 * 	[34.04, -118.2]
 * ];
 *
 * var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
 *
 * // zoom the map to the polyline
 * map.fitBounds(polyline.getBounds());
 * ```
 *
 * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
 *
 * ```js
 * // create a red polyline from an array of arrays of LatLng points
 * var latlngs = [
 * 	[[45.51, -122.68],
 * 	 [37.77, -122.43],
 * 	 [34.04, -118.2]],
 * 	[[40.78, -73.91],
 * 	 [41.83, -87.62],
 * 	 [32.76, -96.72]]
 * ];
 * ```
 */


var Polyline = Path.extend({

	// @section
	// @aka Polyline options
	options: {
		// @option smoothFactor: Number = 1.0
		// How much to simplify the polyline on each zoom level. More means
		// better performance and smoother look, and less means more accurate representation.
		smoothFactor: 1.0,

		// @option noClip: Boolean = false
		// Disable polyline clipping.
		noClip: false
	},

	initialize: function (latlngs, options) {
		setOptions(this, options);
		this._setLatLngs(latlngs);
	},

	// @method getLatLngs(): LatLng[]
	// Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
	getLatLngs: function () {
		return this._latlngs;
	},

	// @method setLatLngs(latlngs: LatLng[]): this
	// Replaces all the points in the polyline with the given array of geographical points.
	setLatLngs: function (latlngs) {
		this._setLatLngs(latlngs);
		return this.redraw();
	},

	// @method isEmpty(): Boolean
	// Returns `true` if the Polyline has no LatLngs.
	isEmpty: function () {
		return !this._latlngs.length;
	},

	// @method closestLayerPoint: Point
	// Returns the point closest to `p` on the Polyline.
	closestLayerPoint: function (p) {
		var minDistance = Infinity,
		    minPoint = null,
		    closest = _sqClosestPointOnSegment,
		    p1, p2;

		for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
			var points = this._parts[j];

			for (var i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];

				var sqDist = closest(p, p1, p2, true);

				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = closest(p, p1, p2);
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return minPoint;
	},

	// @method getCenter(): LatLng
	// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the polyline.
	getCenter: function () {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}

		var i, halfDist, segDist, dist, p1, p2, ratio,
		    points = this._rings[0],
		    len = points.length;

		if (!len) { return null; }

		// polyline centroid algorithm; only uses the first ring if there are multiple

		for (i = 0, halfDist = 0; i < len - 1; i++) {
			halfDist += points[i].distanceTo(points[i + 1]) / 2;
		}

		// The line is so small in the current view that all points are on the same pixel.
		if (halfDist === 0) {
			return this._map.layerPointToLatLng(points[0]);
		}

		for (i = 0, dist = 0; i < len - 1; i++) {
			p1 = points[i];
			p2 = points[i + 1];
			segDist = p1.distanceTo(p2);
			dist += segDist;

			if (dist > halfDist) {
				ratio = (dist - halfDist) / segDist;
				return this._map.layerPointToLatLng([
					p2.x - ratio * (p2.x - p1.x),
					p2.y - ratio * (p2.y - p1.y)
				]);
			}
		}
	},

	// @method getBounds(): LatLngBounds
	// Returns the `LatLngBounds` of the path.
	getBounds: function () {
		return this._bounds;
	},

	// @method addLatLng(latlng: LatLng, latlngs? LatLng[]): this
	// Adds a given point to the polyline. By default, adds to the first ring of
	// the polyline in case of a multi-polyline, but can be overridden by passing
	// a specific ring as a LatLng array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
	addLatLng: function (latlng, latlngs) {
		latlngs = latlngs || this._defaultShape();
		latlng = toLatLng(latlng);
		latlngs.push(latlng);
		this._bounds.extend(latlng);
		return this.redraw();
	},

	_setLatLngs: function (latlngs) {
		this._bounds = new LatLngBounds();
		this._latlngs = this._convertLatLngs(latlngs);
	},

	_defaultShape: function () {
		return isFlat(this._latlngs) ? this._latlngs : this._latlngs[0];
	},

	// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
	_convertLatLngs: function (latlngs) {
		var result = [],
		    flat = isFlat(latlngs);

		for (var i = 0, len = latlngs.length; i < len; i++) {
			if (flat) {
				result[i] = toLatLng(latlngs[i]);
				this._bounds.extend(result[i]);
			} else {
				result[i] = this._convertLatLngs(latlngs[i]);
			}
		}

		return result;
	},

	_project: function () {
		var pxBounds = new Bounds();
		this._rings = [];
		this._projectLatlngs(this._latlngs, this._rings, pxBounds);

		var w = this._clickTolerance(),
		    p = new Point(w, w);

		if (this._bounds.isValid() && pxBounds.isValid()) {
			pxBounds.min._subtract(p);
			pxBounds.max._add(p);
			this._pxBounds = pxBounds;
		}
	},

	// recursively turns latlngs into a set of rings with projected coordinates
	_projectLatlngs: function (latlngs, result, projectedBounds) {
		var flat = latlngs[0] instanceof LatLng,
		    len = latlngs.length,
		    i, ring;

		if (flat) {
			ring = [];
			for (i = 0; i < len; i++) {
				ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
				projectedBounds.extend(ring[i]);
			}
			result.push(ring);
		} else {
			for (i = 0; i < len; i++) {
				this._projectLatlngs(latlngs[i], result, projectedBounds);
			}
		}
	},

	// clip polyline by renderer bounds so that we have less to render for performance
	_clipPoints: function () {
		var bounds = this._renderer._bounds;

		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		var parts = this._parts,
		    i, j, k, len, len2, segment, points;

		for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
			points = this._rings[i];

			for (j = 0, len2 = points.length; j < len2 - 1; j++) {
				segment = clipSegment(points[j], points[j + 1], bounds, j, true);

				if (!segment) { continue; }

				parts[k] = parts[k] || [];
				parts[k].push(segment[0]);

				// if segment goes out of screen, or it's the last one, it's the end of the line part
				if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
					parts[k].push(segment[1]);
					k++;
				}
			}
		}
	},

	// simplify each clipped part of the polyline for performance
	_simplifyPoints: function () {
		var parts = this._parts,
		    tolerance = this.options.smoothFactor;

		for (var i = 0, len = parts.length; i < len; i++) {
			parts[i] = simplify(parts[i], tolerance);
		}
	},

	_update: function () {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();
		this._updatePath();
	},

	_updatePath: function () {
		this._renderer._updatePoly(this);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p, closed) {
		var i, j, k, len, len2, part,
		    w = this._clickTolerance();

		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

		// hit detection for polylines
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) { continue; }

				if (pointToSegmentDistance(p, part[k], part[j]) <= w) {
					return true;
				}
			}
		}
		return false;
	}
});

// @factory L.polyline(latlngs: LatLng[], options?: Polyline options)
// Instantiates a polyline object given an array of geographical points and
// optionally an options object. You can create a `Polyline` object with
// multiple separate lines (`MultiPolyline`) by passing an array of arrays
// of geographic points.
function polyline(latlngs, options) {
	return new Polyline(latlngs, options);
}

// Retrocompat. Allow plugins to support Leaflet versions before and after 1.1.
Polyline._flat = _flat;

/*
 * @class Polygon
 * @aka L.Polygon
 * @inherits Polyline
 *
 * A class for drawing polygon overlays on a map. Extends `Polyline`.
 *
 * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
 *
 *
 * @example
 *
 * ```js
 * // create a red polygon from an array of LatLng points
 * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
 *
 * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
 *
 * // zoom the map to the polygon
 * map.fitBounds(polygon.getBounds());
 * ```
 *
 * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
 *
 * ```js
 * var latlngs = [
 *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
 *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
 * ];
 * ```
 *
 * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
 *
 * ```js
 * var latlngs = [
 *   [ // first polygon
 *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
 *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
 *   ],
 *   [ // second polygon
 *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
 *   ]
 * ];
 * ```
 */

var Polygon = Polyline.extend({

	options: {
		fill: true
	},

	isEmpty: function () {
		return !this._latlngs.length || !this._latlngs[0].length;
	},

	getCenter: function () {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}

		var i, j, p1, p2, f, area, x, y, center,
		    points = this._rings[0],
		    len = points.length;

		if (!len) { return null; }

		// polygon centroid algorithm; only uses the first ring if there are multiple

		area = x = y = 0;

		for (i = 0, j = len - 1; i < len; j = i++) {
			p1 = points[i];
			p2 = points[j];

			f = p1.y * p2.x - p2.y * p1.x;
			x += (p1.x + p2.x) * f;
			y += (p1.y + p2.y) * f;
			area += f * 3;
		}

		if (area === 0) {
			// Polygon is so small that all points are on same pixel.
			center = points[0];
		} else {
			center = [x / area, y / area];
		}
		return this._map.layerPointToLatLng(center);
	},

	_convertLatLngs: function (latlngs) {
		var result = Polyline.prototype._convertLatLngs.call(this, latlngs),
		    len = result.length;

		// remove last point if it equals first one
		if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
			result.pop();
		}
		return result;
	},

	_setLatLngs: function (latlngs) {
		Polyline.prototype._setLatLngs.call(this, latlngs);
		if (isFlat(this._latlngs)) {
			this._latlngs = [this._latlngs];
		}
	},

	_defaultShape: function () {
		return isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
	},

	_clipPoints: function () {
		// polygons need a different clipping algorithm so we redefine that

		var bounds = this._renderer._bounds,
		    w = this.options.weight,
		    p = new Point(w, w);

		// increase clip padding by stroke width to avoid stroke on clip edges
		bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		for (var i = 0, len = this._rings.length, clipped; i < len; i++) {
			clipped = clipPolygon(this._rings[i], bounds, true);
			if (clipped.length) {
				this._parts.push(clipped);
			}
		}
	},

	_updatePath: function () {
		this._renderer._updatePoly(this, true);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint: function (p) {
		var inside = false,
		    part, p1, p2, i, j, k, len, len2;

		if (!this._pxBounds.contains(p)) { return false; }

		// ray casting algorithm for detecting if point is in polygon
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];

				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}

		// also check if it's on polygon stroke
		return inside || Polyline.prototype._containsPoint.call(this, p, true);
	}

});


// @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
function polygon(latlngs, options) {
	return new Polygon(latlngs, options);
}

/*
 * @class GeoJSON
 * @aka L.GeoJSON
 * @inherits FeatureGroup
 *
 * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to parse
 * GeoJSON data and display it on the map. Extends `FeatureGroup`.
 *
 * @example
 *
 * ```js
 * L.geoJSON(data, {
 * 	style: function (feature) {
 * 		return {color: feature.properties.color};
 * 	}
 * }).bindPopup(function (layer) {
 * 	return layer.feature.properties.description;
 * }).addTo(map);
 * ```
 */

var GeoJSON = FeatureGroup.extend({

	/* @section
	 * @aka GeoJSON options
	 *
	 * @option pointToLayer: Function = *
	 * A `Function` defining how GeoJSON points spawn Leaflet layers. It is internally
	 * called when data is added, passing the GeoJSON point feature and its `LatLng`.
	 * The default is to spawn a default `Marker`:
	 * ```js
	 * function(geoJsonPoint, latlng) {
	 * 	return L.marker(latlng);
	 * }
	 * ```
	 *
	 * @option style: Function = *
	 * A `Function` defining the `Path options` for styling GeoJSON lines and polygons,
	 * called internally when data is added.
	 * The default value is to not override any defaults:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return {}
	 * }
	 * ```
	 *
	 * @option onEachFeature: Function = *
	 * A `Function` that will be called once for each created `Feature`, after it has
	 * been created and styled. Useful for attaching events and popups to features.
	 * The default is to do nothing with the newly created layers:
	 * ```js
	 * function (feature, layer) {}
	 * ```
	 *
	 * @option filter: Function = *
	 * A `Function` that will be used to decide whether to include a feature or not.
	 * The default is to include all features:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return true;
	 * }
	 * ```
	 * Note: dynamically changing the `filter` option will have effect only on newly
	 * added data. It will _not_ re-evaluate already included features.
	 *
	 * @option coordsToLatLng: Function = *
	 * A `Function` that will be used for converting GeoJSON coordinates to `LatLng`s.
	 * The default is the `coordsToLatLng` static method.
	 */

	initialize: function (geojson, options) {
		setOptions(this, options);

		this._layers = {};

		if (geojson) {
			this.addData(geojson);
		}
	},

	// @method addData( <GeoJSON> data ): this
	// Adds a GeoJSON object to the layer.
	addData: function (geojson) {
		var features = isArray(geojson) ? geojson : geojson.features,
		    i, len, feature;

		if (features) {
			for (i = 0, len = features.length; i < len; i++) {
				// only add this if geometry or geometries are set and not null
				feature = features[i];
				if (feature.geometries || feature.geometry || feature.features || feature.coordinates) {
					this.addData(feature);
				}
			}
			return this;
		}

		var options = this.options;

		if (options.filter && !options.filter(geojson)) { return this; }

		var layer = geometryToLayer(geojson, options);
		if (!layer) {
			return this;
		}
		layer.feature = asFeature(geojson);

		layer.defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(geojson, layer);
		}

		return this.addLayer(layer);
	},

	// @method resetStyle( <Path> layer ): this
	// Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after hover events.
	resetStyle: function (layer) {
		// reset any custom styles
		layer.options = extend({}, layer.defaultOptions);
		this._setLayerStyle(layer, this.options.style);
		return this;
	},

	// @method setStyle( <Function> style ): this
	// Changes styles of GeoJSON vector layers with the given style function.
	setStyle: function (style) {
		return this.eachLayer(function (layer) {
			this._setLayerStyle(layer, style);
		}, this);
	},

	_setLayerStyle: function (layer, style) {
		if (typeof style === 'function') {
			style = style(layer.feature);
		}
		if (layer.setStyle) {
			layer.setStyle(style);
		}
	}
});

// @section
// There are several static functions which can be called without instantiating L.GeoJSON:

// @function geometryToLayer(featureData: Object, options?: GeoJSON options): Layer
// Creates a `Layer` from a given GeoJSON feature. Can use a custom
// [`pointToLayer`](#geojson-pointtolayer) and/or [`coordsToLatLng`](#geojson-coordstolatlng)
// functions if provided as options.
function geometryToLayer(geojson, options) {

	var geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
	    coords = geometry ? geometry.coordinates : null,
	    layers = [],
	    pointToLayer = options && options.pointToLayer,
	    _coordsToLatLng = options && options.coordsToLatLng || coordsToLatLng,
	    latlng, latlngs, i, len;

	if (!coords && !geometry) {
		return null;
	}

	switch (geometry.type) {
	case 'Point':
		latlng = _coordsToLatLng(coords);
		return pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng);

	case 'MultiPoint':
		for (i = 0, len = coords.length; i < len; i++) {
			latlng = _coordsToLatLng(coords[i]);
			layers.push(pointToLayer ? pointToLayer(geojson, latlng) : new Marker(latlng));
		}
		return new FeatureGroup(layers);

	case 'LineString':
	case 'MultiLineString':
		latlngs = coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
		return new Polyline(latlngs, options);

	case 'Polygon':
	case 'MultiPolygon':
		latlngs = coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
		return new Polygon(latlngs, options);

	case 'GeometryCollection':
		for (i = 0, len = geometry.geometries.length; i < len; i++) {
			var layer = geometryToLayer({
				geometry: geometry.geometries[i],
				type: 'Feature',
				properties: geojson.properties
			}, options);

			if (layer) {
				layers.push(layer);
			}
		}
		return new FeatureGroup(layers);

	default:
		throw new Error('Invalid GeoJSON object.');
	}
}

// @function coordsToLatLng(coords: Array): LatLng
// Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
// or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
function coordsToLatLng(coords) {
	return new LatLng(coords[1], coords[0], coords[2]);
}

// @function coordsToLatLngs(coords: Array, levelsDeep?: Number, coordsToLatLng?: Function): Array
// Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array.
// `levelsDeep` specifies the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by default).
// Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
function coordsToLatLngs(coords, levelsDeep, _coordsToLatLng) {
	var latlngs = [];

	for (var i = 0, len = coords.length, latlng; i < len; i++) {
		latlng = levelsDeep ?
			coordsToLatLngs(coords[i], levelsDeep - 1, _coordsToLatLng) :
			(_coordsToLatLng || coordsToLatLng)(coords[i]);

		latlngs.push(latlng);
	}

	return latlngs;
}

// @function latLngToCoords(latlng: LatLng, precision?: Number): Array
// Reverse of [`coordsToLatLng`](#geojson-coordstolatlng)
function latLngToCoords(latlng, precision) {
	precision = typeof precision === 'number' ? precision : 6;
	return latlng.alt !== undefined ?
		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision), formatNum(latlng.alt, precision)] :
		[formatNum(latlng.lng, precision), formatNum(latlng.lat, precision)];
}

// @function latLngsToCoords(latlngs: Array, levelsDeep?: Number, closed?: Boolean): Array
// Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs)
// `closed` determines whether the first point should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0. False by default.
function latLngsToCoords(latlngs, levelsDeep, closed, precision) {
	var coords = [];

	for (var i = 0, len = latlngs.length; i < len; i++) {
		coords.push(levelsDeep ?
			latLngsToCoords(latlngs[i], levelsDeep - 1, closed, precision) :
			latLngToCoords(latlngs[i], precision));
	}

	if (!levelsDeep && closed) {
		coords.push(coords[0]);
	}

	return coords;
}

function getFeature(layer, newGeometry) {
	return layer.feature ?
		extend({}, layer.feature, {geometry: newGeometry}) :
		asFeature(newGeometry);
}

// @function asFeature(geojson: Object): Object
// Normalize GeoJSON geometries/features into GeoJSON features.
function asFeature(geojson) {
	if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
		return geojson;
	}

	return {
		type: 'Feature',
		properties: {},
		geometry: geojson
	};
}

var PointToGeoJSON = {
	toGeoJSON: function (precision) {
		return getFeature(this, {
			type: 'Point',
			coordinates: latLngToCoords(this.getLatLng(), precision)
		});
	}
};

// @namespace Marker
// @method toGeoJSON(): Object
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the marker (as a GeoJSON `Point` Feature).
Marker.include(PointToGeoJSON);

// @namespace CircleMarker
// @method toGeoJSON(): Object
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the circle marker (as a GeoJSON `Point` Feature).
Circle.include(PointToGeoJSON);
CircleMarker.include(PointToGeoJSON);


// @namespace Polyline
// @method toGeoJSON(): Object
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
Polyline.include({
	toGeoJSON: function (precision) {
		var multi = !isFlat(this._latlngs);

		var coords = latLngsToCoords(this._latlngs, multi ? 1 : 0, false, precision);

		return getFeature(this, {
			type: (multi ? 'Multi' : '') + 'LineString',
			coordinates: coords
		});
	}
});

// @namespace Polygon
// @method toGeoJSON(): Object
// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the polygon (as a GeoJSON `Polygon` or `MultiPolygon` Feature).
Polygon.include({
	toGeoJSON: function (precision) {
		var holes = !isFlat(this._latlngs),
		    multi = holes && !isFlat(this._latlngs[0]);

		var coords = latLngsToCoords(this._latlngs, multi ? 2 : holes ? 1 : 0, true, precision);

		if (!holes) {
			coords = [coords];
		}

		return getFeature(this, {
			type: (multi ? 'Multi' : '') + 'Polygon',
			coordinates: coords
		});
	}
});


// @namespace LayerGroup
LayerGroup.include({
	toMultiPoint: function (precision) {
		var coords = [];

		this.eachLayer(function (layer) {
			coords.push(layer.toGeoJSON(precision).geometry.coordinates);
		});

		return getFeature(this, {
			type: 'MultiPoint',
			coordinates: coords
		});
	},

	// @method toGeoJSON(): Object
	// Returns a [`GeoJSON`](http://en.wikipedia.org/wiki/GeoJSON) representation of the layer group (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
	toGeoJSON: function (precision) {

		var type = this.feature && this.feature.geometry && this.feature.geometry.type;

		if (type === 'MultiPoint') {
			return this.toMultiPoint(precision);
		}

		var isGeometryCollection = type === 'GeometryCollection',
		    jsons = [];

		this.eachLayer(function (layer) {
			if (layer.toGeoJSON) {
				var json = layer.toGeoJSON(precision);
				if (isGeometryCollection) {
					jsons.push(json.geometry);
				} else {
					var feature = asFeature(json);
					// Squash nested feature collections
					if (feature.type === 'FeatureCollection') {
						jsons.push.apply(jsons, feature.features);
					} else {
						jsons.push(feature);
					}
				}
			}
		});

		if (isGeometryCollection) {
			return getFeature(this, {
				geometries: jsons,
				type: 'GeometryCollection'
			});
		}

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}
});

// @namespace GeoJSON
// @factory L.geoJSON(geojson?: Object, options?: GeoJSON options)
// Creates a GeoJSON layer. Optionally accepts an object in
// [GeoJSON format](http://geojson.org/geojson-spec.html) to display on the map
// (you can alternatively add it later with `addData` method) and an `options` object.
function geoJSON(geojson, options) {
	return new GeoJSON(geojson, options);
}

// Backward compatibility.
var geoJson = geoJSON;

/*
 * @class ImageOverlay
 * @aka L.ImageOverlay
 * @inherits Interactive layer
 *
 * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
 * L.imageOverlay(imageUrl, imageBounds).addTo(map);
 * ```
 */

var ImageOverlay = Layer.extend({

	// @section
	// @aka ImageOverlay options
	options: {
		// @option opacity: Number = 1.0
		// The opacity of the image overlay.
		opacity: 1,

		// @option alt: String = ''
		// Text for the `alt` attribute of the image (useful for accessibility).
		alt: '',

		// @option interactive: Boolean = false
		// If `true`, the image overlay will emit [mouse events](#interactive-layer) when clicked or hovered.
		interactive: false,

		// @option crossOrigin: Boolean = false
		// If true, the image will have its crossOrigin attribute set to ''. This is needed if you want to access image pixel data.
		crossOrigin: false,

		// @option errorOverlayUrl: String = ''
		// URL to the overlay image to show in place of the overlay that failed to load.
		errorOverlayUrl: '',

		// @option zIndex: Number = 1
		// The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index) of the tile layer.
		zIndex: 1,

		// @option className: String = ''
		// A custom class name to assign to the image. Empty by default.
		className: '',
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = toLatLngBounds(bounds);

		setOptions(this, options);
	},

	onAdd: function () {
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		if (this.options.interactive) {
			addClass(this._image, 'leaflet-interactive');
			this.addInteractiveTarget(this._image);
		}

		this.getPane().appendChild(this._image);
		this._reset();
	},

	onRemove: function () {
		remove(this._image);
		if (this.options.interactive) {
			this.removeInteractiveTarget(this._image);
		}
	},

	// @method setOpacity(opacity: Number): this
	// Sets the opacity of the overlay.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._image) {
			this._updateOpacity();
		}
		return this;
	},

	setStyle: function (styleOpts) {
		if (styleOpts.opacity) {
			this.setOpacity(styleOpts.opacity);
		}
		return this;
	},

	// @method bringToFront(): this
	// Brings the layer to the top of all overlays.
	bringToFront: function () {
		if (this._map) {
			toFront(this._image);
		}
		return this;
	},

	// @method bringToBack(): this
	// Brings the layer to the bottom of all overlays.
	bringToBack: function () {
		if (this._map) {
			toBack(this._image);
		}
		return this;
	},

	// @method setUrl(url: String): this
	// Changes the URL of the image.
	setUrl: function (url) {
		this._url = url;

		if (this._image) {
			this._image.src = url;
		}
		return this;
	},

	// @method setBounds(bounds: LatLngBounds): this
	// Update the bounds that this ImageOverlay covers
	setBounds: function (bounds) {
		this._bounds = toLatLngBounds(bounds);

		if (this._map) {
			this._reset();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			zoom: this._reset,
			viewreset: this._reset
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	// @method: setZIndex(value: Number) : this
	// Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
	setZIndex: function (value) {
		this.options.zIndex = value;
		this._updateZIndex();
		return this;
	},

	// @method getBounds(): LatLngBounds
	// Get the bounds that this ImageOverlay covers
	getBounds: function () {
		return this._bounds;
	},

	// @method getElement(): HTMLElement
	// Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
	// used by this overlay.
	getElement: function () {
		return this._image;
	},

	_initImage: function () {
		var wasElementSupplied = this._url.tagName === 'IMG';
		var img = this._image = wasElementSupplied ? this._url : create$1('img');

		addClass(img, 'leaflet-image-layer');
		if (this._zoomAnimated) { addClass(img, 'leaflet-zoom-animated'); }
		if (this.options.className) { addClass(img, this.options.className); }

		img.onselectstart = falseFn;
		img.onmousemove = falseFn;

		// @event load: Event
		// Fired when the ImageOverlay layer has loaded its image
		img.onload = bind(this.fire, this, 'load');
		img.onerror = bind(this._overlayOnError, this, 'error');

		if (this.options.crossOrigin) {
			img.crossOrigin = '';
		}

		if (this.options.zIndex) {
			this._updateZIndex();
		}

		if (wasElementSupplied) {
			this._url = img.src;
			return;
		}

		img.src = this._url;
		img.alt = this.options.alt;
	},

	_animateZoom: function (e) {
		var scale = this._map.getZoomScale(e.zoom),
		    offset = this._map._latLngBoundsToNewLayerBounds(this._bounds, e.zoom, e.center).min;

		setTransform(this._image, offset, scale);
	},

	_reset: function () {
		var image = this._image,
		    bounds = new Bounds(
		        this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		        this._map.latLngToLayerPoint(this._bounds.getSouthEast())),
		    size = bounds.getSize();

		setPosition(image, bounds.min);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_updateOpacity: function () {
		setOpacity(this._image, this.options.opacity);
	},

	_updateZIndex: function () {
		if (this._image && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._image.style.zIndex = this.options.zIndex;
		}
	},

	_overlayOnError: function () {
		// @event error: Event
		// Fired when the ImageOverlay layer has loaded its image
		this.fire('error');

		var errorUrl = this.options.errorOverlayUrl;
		if (errorUrl && this._url !== errorUrl) {
			this._url = errorUrl;
			this._image.src = errorUrl;
		}
	}
});

// @factory L.imageOverlay(imageUrl: String, bounds: LatLngBounds, options?: ImageOverlay options)
// Instantiates an image overlay object given the URL of the image and the
// geographical bounds it is tied to.
var imageOverlay = function (url, bounds, options) {
	return new ImageOverlay(url, bounds, options);
};

/*
 * @class VideoOverlay
 * @aka L.VideoOverlay
 * @inherits ImageOverlay
 *
 * Used to load and display a video player over specific bounds of the map. Extends `ImageOverlay`.
 *
 * A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video)
 * HTML5 element.
 *
 * @example
 *
 * ```js
 * var videoUrl = 'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
 * 	videoBounds = [[ 32, -130], [ 13, -100]];
 * L.VideoOverlay(videoUrl, videoBounds ).addTo(map);
 * ```
 */

var VideoOverlay = ImageOverlay.extend({

	// @section
	// @aka VideoOverlay options
	options: {
		// @option autoplay: Boolean = true
		// Whether the video starts playing automatically when loaded.
		autoplay: true,

		// @option loop: Boolean = true
		// Whether the video will loop back to the beginning when played.
		loop: true
	},

	_initImage: function () {
		var wasElementSupplied = this._url.tagName === 'VIDEO';
		var vid = this._image = wasElementSupplied ? this._url : create$1('video');

		addClass(vid, 'leaflet-image-layer');
		if (this._zoomAnimated) { addClass(vid, 'leaflet-zoom-animated'); }

		vid.onselectstart = falseFn;
		vid.onmousemove = falseFn;

		// @event load: Event
		// Fired when the video has finished loading the first frame
		vid.onloadeddata = bind(this.fire, this, 'load');

		if (wasElementSupplied) {
			var sourceElements = vid.getElementsByTagName('source');
			var sources = [];
			for (var j = 0; j < sourceElements.length; j++) {
				sources.push(sourceElements[j].src);
			}

			this._url = (sourceElements.length > 0) ? sources : [vid.src];
			return;
		}

		if (!isArray(this._url)) { this._url = [this._url]; }

		vid.autoplay = !!this.options.autoplay;
		vid.loop = !!this.options.loop;
		for (var i = 0; i < this._url.length; i++) {
			var source = create$1('source');
			source.src = this._url[i];
			vid.appendChild(source);
		}
	}

	// @method getElement(): HTMLVideoElement
	// Returns the instance of [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLVideoElement)
	// used by this overlay.
});


// @factory L.videoOverlay(video: String|Array|HTMLVideoElement, bounds: LatLngBounds, options?: VideoOverlay options)
// Instantiates an image overlay object given the URL of the video (or array of URLs, or even a video element) and the
// geographical bounds it is tied to.

function videoOverlay(video, bounds, options) {
	return new VideoOverlay(video, bounds, options);
}

/*
 * @class DivOverlay
 * @inherits Layer
 * @aka L.DivOverlay
 * Base model for L.Popup and L.Tooltip. Inherit from it for custom popup like plugins.
 */

// @namespace DivOverlay
var DivOverlay = Layer.extend({

	// @section
	// @aka DivOverlay options
	options: {
		// @option offset: Point = Point(0, 7)
		// The offset of the popup position. Useful to control the anchor
		// of the popup when opening it on some overlays.
		offset: [0, 7],

		// @option className: String = ''
		// A custom CSS class name to assign to the popup.
		className: '',

		// @option pane: String = 'popupPane'
		// `Map pane` where the popup will be added.
		pane: 'popupPane'
	},

	initialize: function (options, source) {
		setOptions(this, options);

		this._source = source;
	},

	onAdd: function (map) {
		this._zoomAnimated = map._zoomAnimated;

		if (!this._container) {
			this._initLayout();
		}

		if (map._fadeAnimated) {
			setOpacity(this._container, 0);
		}

		clearTimeout(this._removeTimeout);
		this.getPane().appendChild(this._container);
		this.update();

		if (map._fadeAnimated) {
			setOpacity(this._container, 1);
		}

		this.bringToFront();
	},

	onRemove: function (map) {
		if (map._fadeAnimated) {
			setOpacity(this._container, 0);
			this._removeTimeout = setTimeout(bind(remove, undefined, this._container), 200);
		} else {
			remove(this._container);
		}
	},

	// @namespace Popup
	// @method getLatLng: LatLng
	// Returns the geographical point of popup.
	getLatLng: function () {
		return this._latlng;
	},

	// @method setLatLng(latlng: LatLng): this
	// Sets the geographical point where the popup will open.
	setLatLng: function (latlng) {
		this._latlng = toLatLng(latlng);
		if (this._map) {
			this._updatePosition();
			this._adjustPan();
		}
		return this;
	},

	// @method getContent: String|HTMLElement
	// Returns the content of the popup.
	getContent: function () {
		return this._content;
	},

	// @method setContent(htmlContent: String|HTMLElement|Function): this
	// Sets the HTML content of the popup. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the popup.
	setContent: function (content) {
		this._content = content;
		this.update();
		return this;
	},

	// @method getElement: String|HTMLElement
	// Alias for [getContent()](#popup-getcontent)
	getElement: function () {
		return this._container;
	},

	// @method update: null
	// Updates the popup content, layout and position. Useful for updating the popup after something inside changed, e.g. image loaded.
	update: function () {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	getEvents: function () {
		var events = {
			zoom: this._updatePosition,
			viewreset: this._updatePosition
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}
		return events;
	},

	// @method isOpen: Boolean
	// Returns `true` when the popup is visible on the map.
	isOpen: function () {
		return !!this._map && this._map.hasLayer(this);
	},

	// @method bringToFront: this
	// Brings this popup in front of other popups (in the same map pane).
	bringToFront: function () {
		if (this._map) {
			toFront(this._container);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings this popup to the back of other popups (in the same map pane).
	bringToBack: function () {
		if (this._map) {
			toBack(this._container);
		}
		return this;
	},

	_updateContent: function () {
		if (!this._content) { return; }

		var node = this._contentNode;
		var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

		if (typeof content === 'string') {
			node.innerHTML = content;
		} else {
			while (node.hasChildNodes()) {
				node.removeChild(node.firstChild);
			}
			node.appendChild(content);
		}
		this.fire('contentupdate');
	},

	_updatePosition: function () {
		if (!this._map) { return; }

		var pos = this._map.latLngToLayerPoint(this._latlng),
		    offset = toPoint(this.options.offset),
		    anchor = this._getAnchor();

		if (this._zoomAnimated) {
			setPosition(this._container, pos.add(anchor));
		} else {
			offset = offset.add(pos).add(anchor);
		}

		var bottom = this._containerBottom = -offset.y,
		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		// bottom position the popup in case the height of the popup changes (images loading etc)
		this._container.style.bottom = bottom + 'px';
		this._container.style.left = left + 'px';
	},

	_getAnchor: function () {
		return [0, 0];
	}

});

/*
 * @class Popup
 * @inherits DivOverlay
 * @aka L.Popup
 * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup) to
 * open popups while making sure that only one popup is open at one time
 * (recommended for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
 *
 * @example
 *
 * If you want to just bind a popup to marker click and then open it, it's really easy:
 *
 * ```js
 * marker.bindPopup(popupContent).openPopup();
 * ```
 * Path overlays like polylines also have a `bindPopup` method.
 * Here's a more complicated way to open a popup on a map:
 *
 * ```js
 * var popup = L.popup()
 * 	.setLatLng(latlng)
 * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
 * 	.openOn(map);
 * ```
 */


// @namespace Popup
var Popup = DivOverlay.extend({

	// @section
	// @aka Popup options
	options: {
		// @option maxWidth: Number = 300
		// Max width of the popup, in pixels.
		maxWidth: 300,

		// @option minWidth: Number = 50
		// Min width of the popup, in pixels.
		minWidth: 50,

		// @option maxHeight: Number = null
		// If set, creates a scrollable container of the given height
		// inside a popup if its content exceeds it.
		maxHeight: null,

		// @option autoPan: Boolean = true
		// Set it to `false` if you don't want the map to do panning animation
		// to fit the opened popup.
		autoPan: true,

		// @option autoPanPaddingTopLeft: Point = null
		// The margin between the popup and the top left corner of the map
		// view after autopanning was performed.
		autoPanPaddingTopLeft: null,

		// @option autoPanPaddingBottomRight: Point = null
		// The margin between the popup and the bottom right corner of the map
		// view after autopanning was performed.
		autoPanPaddingBottomRight: null,

		// @option autoPanPadding: Point = Point(5, 5)
		// Equivalent of setting both top left and bottom right autopan padding to the same value.
		autoPanPadding: [5, 5],

		// @option keepInView: Boolean = false
		// Set it to `true` if you want to prevent users from panning the popup
		// off of the screen while it is open.
		keepInView: false,

		// @option closeButton: Boolean = true
		// Controls the presence of a close button in the popup.
		closeButton: true,

		// @option autoClose: Boolean = true
		// Set it to `false` if you want to override the default behavior of
		// the popup closing when another popup is opened.
		autoClose: true,

		// @option closeOnEscapeKey: Boolean = true
		// Set it to `false` if you want to override the default behavior of
		// the ESC key for closing of the popup.
		closeOnEscapeKey: true,

		// @option closeOnClick: Boolean = *
		// Set it if you want to override the default behavior of the popup closing when user clicks
		// on the map. Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.

		// @option className: String = ''
		// A custom CSS class name to assign to the popup.
		className: ''
	},

	// @namespace Popup
	// @method openOn(map: Map): this
	// Adds the popup to the map and closes the previous one. The same as `map.openPopup(popup)`.
	openOn: function (map) {
		map.openPopup(this);
		return this;
	},

	onAdd: function (map) {
		DivOverlay.prototype.onAdd.call(this, map);

		// @namespace Map
		// @section Popup events
		// @event popupopen: PopupEvent
		// Fired when a popup is opened in the map
		map.fire('popupopen', {popup: this});

		if (this._source) {
			// @namespace Layer
			// @section Popup events
			// @event popupopen: PopupEvent
			// Fired when a popup bound to this layer is opened
			this._source.fire('popupopen', {popup: this}, true);
			// For non-path layers, we toggle the popup when clicking
			// again the layer, so prevent the map to reopen it.
			if (!(this._source instanceof Path)) {
				this._source.on('preclick', stopPropagation);
			}
		}
	},

	onRemove: function (map) {
		DivOverlay.prototype.onRemove.call(this, map);

		// @namespace Map
		// @section Popup events
		// @event popupclose: PopupEvent
		// Fired when a popup in the map is closed
		map.fire('popupclose', {popup: this});

		if (this._source) {
			// @namespace Layer
			// @section Popup events
			// @event popupclose: PopupEvent
			// Fired when a popup bound to this layer is closed
			this._source.fire('popupclose', {popup: this}, true);
			if (!(this._source instanceof Path)) {
				this._source.off('preclick', stopPropagation);
			}
		}
	},

	getEvents: function () {
		var events = DivOverlay.prototype.getEvents.call(this);

		if (this.options.closeOnClick !== undefined ? this.options.closeOnClick : this._map.options.closePopupOnClick) {
			events.preclick = this._close;
		}

		if (this.options.keepInView) {
			events.moveend = this._adjustPan;
		}

		return events;
	},

	_close: function () {
		if (this._map) {
			this._map.closePopup(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-popup',
		    container = this._container = create$1('div',
			prefix + ' ' + (this.options.className || '') +
			' leaflet-zoom-animated');

		var wrapper = this._wrapper = create$1('div', prefix + '-content-wrapper', container);
		this._contentNode = create$1('div', prefix + '-content', wrapper);

		disableClickPropagation(wrapper);
		disableScrollPropagation(this._contentNode);
		on(wrapper, 'contextmenu', stopPropagation);

		this._tipContainer = create$1('div', prefix + '-tip-container', container);
		this._tip = create$1('div', prefix + '-tip', this._tipContainer);

		if (this.options.closeButton) {
			var closeButton = this._closeButton = create$1('a', prefix + '-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';

			on(closeButton, 'click', this._onCloseButtonClick, this);
		}
	},

	_updateLayout: function () {
		var container = this._contentNode,
		    style = container.style;

		style.width = '';
		style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		style.width = (width + 1) + 'px';
		style.whiteSpace = '';

		style.height = '';

		var height = container.offsetHeight,
		    maxHeight = this.options.maxHeight,
		    scrolledClass = 'leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			style.height = maxHeight + 'px';
			addClass(container, scrolledClass);
		} else {
			removeClass(container, scrolledClass);
		}

		this._containerWidth = this._container.offsetWidth;
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center),
		    anchor = this._getAnchor();
		setPosition(this._container, pos.add(anchor));
	},

	_adjustPan: function () {
		if (!this.options.autoPan || (this._map._panAnim && this._map._panAnim._inProgress)) { return; }

		var map = this._map,
		    marginBottom = parseInt(getStyle(this._container, 'marginBottom'), 10) || 0,
		    containerHeight = this._container.offsetHeight + marginBottom,
		    containerWidth = this._containerWidth,
		    layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);

		layerPos._add(getPosition(this._container));

		var containerPos = map.layerPointToContainerPoint(layerPos),
		    padding = toPoint(this.options.autoPanPadding),
		    paddingTL = toPoint(this.options.autoPanPaddingTopLeft || padding),
		    paddingBR = toPoint(this.options.autoPanPaddingBottomRight || padding),
		    size = map.getSize(),
		    dx = 0,
		    dy = 0;

		if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
			dx = containerPos.x + containerWidth - size.x + paddingBR.x;
		}
		if (containerPos.x - dx - paddingTL.x < 0) { // left
			dx = containerPos.x - paddingTL.x;
		}
		if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
			dy = containerPos.y + containerHeight - size.y + paddingBR.y;
		}
		if (containerPos.y - dy - paddingTL.y < 0) { // top
			dy = containerPos.y - paddingTL.y;
		}

		// @namespace Map
		// @section Popup events
		// @event autopanstart: Event
		// Fired when the map starts autopanning when opening a popup.
		if (dx || dy) {
			map
			    .fire('autopanstart')
			    .panBy([dx, dy]);
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		stop(e);
	},

	_getAnchor: function () {
		// Where should we anchor the popup on the source layer?
		return toPoint(this._source && this._source._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
	}

});

// @namespace Popup
// @factory L.popup(options?: Popup options, source?: Layer)
// Instantiates a `Popup` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the popup with a reference to the Layer to which it refers.
var popup = function (options, source) {
	return new Popup(options, source);
};


/* @namespace Map
 * @section Interaction Options
 * @option closePopupOnClick: Boolean = true
 * Set it to `false` if you don't want popups to close when user clicks the map.
 */
Map.mergeOptions({
	closePopupOnClick: true
});


// @namespace Map
// @section Methods for Layers and Controls
Map.include({
	// @method openPopup(popup: Popup): this
	// Opens the specified popup while closing the previously opened (to make sure only one is opened at one time for usability).
	// @alternative
	// @method openPopup(content: String|HTMLElement, latlng: LatLng, options?: Popup options): this
	// Creates a popup with the specified content and options and opens it in the given point on a map.
	openPopup: function (popup, latlng, options) {
		if (!(popup instanceof Popup)) {
			popup = new Popup(options).setContent(popup);
		}

		if (latlng) {
			popup.setLatLng(latlng);
		}

		if (this.hasLayer(popup)) {
			return this;
		}

		if (this._popup && this._popup.options.autoClose) {
			this.closePopup();
		}

		this._popup = popup;
		return this.addLayer(popup);
	},

	// @method closePopup(popup?: Popup): this
	// Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
	closePopup: function (popup) {
		if (!popup || popup === this._popup) {
			popup = this._popup;
			this._popup = null;
		}
		if (popup) {
			this.removeLayer(popup);
		}
		return this;
	}
});

/*
 * @namespace Layer
 * @section Popup methods example
 *
 * All layers share a set of methods convenient for binding popups to it.
 *
 * ```js
 * var layer = L.Polygon(latlngs).bindPopup('Hi There!').addTo(map);
 * layer.openPopup();
 * layer.closePopup();
 * ```
 *
 * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from the map or another popup is opened.
 */

// @section Popup methods
Layer.include({

	// @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
	// Binds a popup to the layer with the passed `content` and sets up the
	// necessary event listeners. If a `Function` is passed it will receive
	// the layer as the first argument and should return a `String` or `HTMLElement`.
	bindPopup: function (content, options) {

		if (content instanceof Popup) {
			setOptions(content, options);
			this._popup = content;
			content._source = this;
		} else {
			if (!this._popup || options) {
				this._popup = new Popup(options, this);
			}
			this._popup.setContent(content);
		}

		if (!this._popupHandlersAdded) {
			this.on({
				click: this._openPopup,
				keypress: this._onKeyPress,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popupHandlersAdded = true;
		}

		return this;
	},

	// @method unbindPopup(): this
	// Removes the popup previously bound with `bindPopup`.
	unbindPopup: function () {
		if (this._popup) {
			this.off({
				click: this._openPopup,
				keypress: this._onKeyPress,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popupHandlersAdded = false;
			this._popup = null;
		}
		return this;
	},

	// @method openPopup(latlng?: LatLng): this
	// Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
	openPopup: function (layer, latlng) {
		if (!(layer instanceof Layer)) {
			latlng = layer;
			layer = this;
		}

		if (layer instanceof FeatureGroup) {
			for (var id in this._layers) {
				layer = this._layers[id];
				break;
			}
		}

		if (!latlng) {
			latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
		}

		if (this._popup && this._map) {
			// set popup source to this layer
			this._popup._source = layer;

			// update the popup (content, layout, ect...)
			this._popup.update();

			// open the popup on the map
			this._map.openPopup(this._popup, latlng);
		}

		return this;
	},

	// @method closePopup(): this
	// Closes the popup bound to this layer if it is open.
	closePopup: function () {
		if (this._popup) {
			this._popup._close();
		}
		return this;
	},

	// @method togglePopup(): this
	// Opens or closes the popup bound to this layer depending on its current state.
	togglePopup: function (target) {
		if (this._popup) {
			if (this._popup._map) {
				this.closePopup();
			} else {
				this.openPopup(target);
			}
		}
		return this;
	},

	// @method isPopupOpen(): boolean
	// Returns `true` if the popup bound to this layer is currently open.
	isPopupOpen: function () {
		return (this._popup ? this._popup.isOpen() : false);
	},

	// @method setPopupContent(content: String|HTMLElement|Popup): this
	// Sets the content of the popup bound to this layer.
	setPopupContent: function (content) {
		if (this._popup) {
			this._popup.setContent(content);
		}
		return this;
	},

	// @method getPopup(): Popup
	// Returns the popup bound to this layer.
	getPopup: function () {
		return this._popup;
	},

	_openPopup: function (e) {
		var layer = e.layer || e.target;

		if (!this._popup) {
			return;
		}

		if (!this._map) {
			return;
		}

		// prevent map click
		stop(e);

		// if this inherits from Path its a vector and we can just
		// open the popup at the new location
		if (layer instanceof Path) {
			this.openPopup(e.layer || e.target, e.latlng);
			return;
		}

		// otherwise treat it like a marker and figure out
		// if we should toggle it open/closed
		if (this._map.hasLayer(this._popup) && this._popup._source === layer) {
			this.closePopup();
		} else {
			this.openPopup(layer, e.latlng);
		}
	},

	_movePopup: function (e) {
		this._popup.setLatLng(e.latlng);
	},

	_onKeyPress: function (e) {
		if (e.originalEvent.keyCode === 13) {
			this._openPopup(e);
		}
	}
});

/*
 * @class Tooltip
 * @inherits DivOverlay
 * @aka L.Tooltip
 * Used to display small texts on top of map layers.
 *
 * @example
 *
 * ```js
 * marker.bindTooltip("my tooltip text").openTooltip();
 * ```
 * Note about tooltip offset. Leaflet takes two options in consideration
 * for computing tooltip offsetting:
 * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
 *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
 *   move it to the bottom. Negatives will move to the left and top.
 * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
 *   should adapt this value if you use a custom icon.
 */


// @namespace Tooltip
var Tooltip = DivOverlay.extend({

	// @section
	// @aka Tooltip options
	options: {
		// @option pane: String = 'tooltipPane'
		// `Map pane` where the tooltip will be added.
		pane: 'tooltipPane',

		// @option offset: Point = Point(0, 0)
		// Optional offset of the tooltip position.
		offset: [0, 0],

		// @option direction: String = 'auto'
		// Direction where to open the tooltip. Possible values are: `right`, `left`,
		// `top`, `bottom`, `center`, `auto`.
		// `auto` will dynamically switch between `right` and `left` according to the tooltip
		// position on the map.
		direction: 'auto',

		// @option permanent: Boolean = false
		// Whether to open the tooltip permanently or only on mouseover.
		permanent: false,

		// @option sticky: Boolean = false
		// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
		sticky: false,

		// @option interactive: Boolean = false
		// If true, the tooltip will listen to the feature events.
		interactive: false,

		// @option opacity: Number = 0.9
		// Tooltip container opacity.
		opacity: 0.9
	},

	onAdd: function (map) {
		DivOverlay.prototype.onAdd.call(this, map);
		this.setOpacity(this.options.opacity);

		// @namespace Map
		// @section Tooltip events
		// @event tooltipopen: TooltipEvent
		// Fired when a tooltip is opened in the map.
		map.fire('tooltipopen', {tooltip: this});

		if (this._source) {
			// @namespace Layer
			// @section Tooltip events
			// @event tooltipopen: TooltipEvent
			// Fired when a tooltip bound to this layer is opened.
			this._source.fire('tooltipopen', {tooltip: this}, true);
		}
	},

	onRemove: function (map) {
		DivOverlay.prototype.onRemove.call(this, map);

		// @namespace Map
		// @section Tooltip events
		// @event tooltipclose: TooltipEvent
		// Fired when a tooltip in the map is closed.
		map.fire('tooltipclose', {tooltip: this});

		if (this._source) {
			// @namespace Layer
			// @section Tooltip events
			// @event tooltipclose: TooltipEvent
			// Fired when a tooltip bound to this layer is closed.
			this._source.fire('tooltipclose', {tooltip: this}, true);
		}
	},

	getEvents: function () {
		var events = DivOverlay.prototype.getEvents.call(this);

		if (touch && !this.options.permanent) {
			events.preclick = this._close;
		}

		return events;
	},

	_close: function () {
		if (this._map) {
			this._map.closeTooltip(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-tooltip',
		    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		this._contentNode = this._container = create$1('div', className);
	},

	_updateLayout: function () {},

	_adjustPan: function () {},

	_setPosition: function (pos) {
		var map = this._map,
		    container = this._container,
		    centerPoint = map.latLngToContainerPoint(map.getCenter()),
		    tooltipPoint = map.layerPointToContainerPoint(pos),
		    direction = this.options.direction,
		    tooltipWidth = container.offsetWidth,
		    tooltipHeight = container.offsetHeight,
		    offset = toPoint(this.options.offset),
		    anchor = this._getAnchor();

		if (direction === 'top') {
			pos = pos.add(toPoint(-tooltipWidth / 2 + offset.x, -tooltipHeight + offset.y + anchor.y, true));
		} else if (direction === 'bottom') {
			pos = pos.subtract(toPoint(tooltipWidth / 2 - offset.x, -offset.y, true));
		} else if (direction === 'center') {
			pos = pos.subtract(toPoint(tooltipWidth / 2 + offset.x, tooltipHeight / 2 - anchor.y + offset.y, true));
		} else if (direction === 'right' || direction === 'auto' && tooltipPoint.x < centerPoint.x) {
			direction = 'right';
			pos = pos.add(toPoint(offset.x + anchor.x, anchor.y - tooltipHeight / 2 + offset.y, true));
		} else {
			direction = 'left';
			pos = pos.subtract(toPoint(tooltipWidth + anchor.x - offset.x, tooltipHeight / 2 - anchor.y - offset.y, true));
		}

		removeClass(container, 'leaflet-tooltip-right');
		removeClass(container, 'leaflet-tooltip-left');
		removeClass(container, 'leaflet-tooltip-top');
		removeClass(container, 'leaflet-tooltip-bottom');
		addClass(container, 'leaflet-tooltip-' + direction);
		setPosition(container, pos);
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);
		this._setPosition(pos);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._container) {
			setOpacity(this._container, opacity);
		}
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
		this._setPosition(pos);
	},

	_getAnchor: function () {
		// Where should we anchor the tooltip on the source layer?
		return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
	}

});

// @namespace Tooltip
// @factory L.tooltip(options?: Tooltip options, source?: Layer)
// Instantiates a Tooltip object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
var tooltip = function (options, source) {
	return new Tooltip(options, source);
};

// @namespace Map
// @section Methods for Layers and Controls
Map.include({

	// @method openTooltip(tooltip: Tooltip): this
	// Opens the specified tooltip.
	// @alternative
	// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
	// Creates a tooltip with the specified content and options and open it.
	openTooltip: function (tooltip, latlng, options) {
		if (!(tooltip instanceof Tooltip)) {
			tooltip = new Tooltip(options).setContent(tooltip);
		}

		if (latlng) {
			tooltip.setLatLng(latlng);
		}

		if (this.hasLayer(tooltip)) {
			return this;
		}

		return this.addLayer(tooltip);
	},

	// @method closeTooltip(tooltip?: Tooltip): this
	// Closes the tooltip given as parameter.
	closeTooltip: function (tooltip) {
		if (tooltip) {
			this.removeLayer(tooltip);
		}
		return this;
	}

});

/*
 * @namespace Layer
 * @section Tooltip methods example
 *
 * All layers share a set of methods convenient for binding tooltips to it.
 *
 * ```js
 * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
 * layer.openTooltip();
 * layer.closeTooltip();
 * ```
 */

// @section Tooltip methods
Layer.include({

	// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
	// Binds a tooltip to the layer with the passed `content` and sets up the
	// necessary event listeners. If a `Function` is passed it will receive
	// the layer as the first argument and should return a `String` or `HTMLElement`.
	bindTooltip: function (content, options) {

		if (content instanceof Tooltip) {
			setOptions(content, options);
			this._tooltip = content;
			content._source = this;
		} else {
			if (!this._tooltip || options) {
				this._tooltip = new Tooltip(options, this);
			}
			this._tooltip.setContent(content);

		}

		this._initTooltipInteractions();

		if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
			this.openTooltip();
		}

		return this;
	},

	// @method unbindTooltip(): this
	// Removes the tooltip previously bound with `bindTooltip`.
	unbindTooltip: function () {
		if (this._tooltip) {
			this._initTooltipInteractions(true);
			this.closeTooltip();
			this._tooltip = null;
		}
		return this;
	},

	_initTooltipInteractions: function (remove$$1) {
		if (!remove$$1 && this._tooltipHandlersAdded) { return; }
		var onOff = remove$$1 ? 'off' : 'on',
		    events = {
			remove: this.closeTooltip,
			move: this._moveTooltip
		    };
		if (!this._tooltip.options.permanent) {
			events.mouseover = this._openTooltip;
			events.mouseout = this.closeTooltip;
			if (this._tooltip.options.sticky) {
				events.mousemove = this._moveTooltip;
			}
			if (touch) {
				events.click = this._openTooltip;
			}
		} else {
			events.add = this._openTooltip;
		}
		this[onOff](events);
		this._tooltipHandlersAdded = !remove$$1;
	},

	// @method openTooltip(latlng?: LatLng): this
	// Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
	openTooltip: function (layer, latlng) {
		if (!(layer instanceof Layer)) {
			latlng = layer;
			layer = this;
		}

		if (layer instanceof FeatureGroup) {
			for (var id in this._layers) {
				layer = this._layers[id];
				break;
			}
		}

		if (!latlng) {
			latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
		}

		if (this._tooltip && this._map) {

			// set tooltip source to this layer
			this._tooltip._source = layer;

			// update the tooltip (content, layout, ect...)
			this._tooltip.update();

			// open the tooltip on the map
			this._map.openTooltip(this._tooltip, latlng);

			// Tooltip container may not be defined if not permanent and never
			// opened.
			if (this._tooltip.options.interactive && this._tooltip._container) {
				addClass(this._tooltip._container, 'leaflet-clickable');
				this.addInteractiveTarget(this._tooltip._container);
			}
		}

		return this;
	},

	// @method closeTooltip(): this
	// Closes the tooltip bound to this layer if it is open.
	closeTooltip: function () {
		if (this._tooltip) {
			this._tooltip._close();
			if (this._tooltip.options.interactive && this._tooltip._container) {
				removeClass(this._tooltip._container, 'leaflet-clickable');
				this.removeInteractiveTarget(this._tooltip._container);
			}
		}
		return this;
	},

	// @method toggleTooltip(): this
	// Opens or closes the tooltip bound to this layer depending on its current state.
	toggleTooltip: function (target) {
		if (this._tooltip) {
			if (this._tooltip._map) {
				this.closeTooltip();
			} else {
				this.openTooltip(target);
			}
		}
		return this;
	},

	// @method isTooltipOpen(): boolean
	// Returns `true` if the tooltip bound to this layer is currently open.
	isTooltipOpen: function () {
		return this._tooltip.isOpen();
	},

	// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
	// Sets the content of the tooltip bound to this layer.
	setTooltipContent: function (content) {
		if (this._tooltip) {
			this._tooltip.setContent(content);
		}
		return this;
	},

	// @method getTooltip(): Tooltip
	// Returns the tooltip bound to this layer.
	getTooltip: function () {
		return this._tooltip;
	},

	_openTooltip: function (e) {
		var layer = e.layer || e.target;

		if (!this._tooltip || !this._map) {
			return;
		}
		this.openTooltip(layer, this._tooltip.options.sticky ? e.latlng : undefined);
	},

	_moveTooltip: function (e) {
		var latlng = e.latlng, containerPoint, layerPoint;
		if (this._tooltip.options.sticky && e.originalEvent) {
			containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
			latlng = this._map.layerPointToLatLng(layerPoint);
		}
		this._tooltip.setLatLng(latlng);
	}
});

/*
 * @class DivIcon
 * @aka L.DivIcon
 * @inherits Icon
 *
 * Represents a lightweight icon for markers that uses a simple `<div>`
 * element instead of an image. Inherits from `Icon` but ignores the `iconUrl` and shadow options.
 *
 * @example
 * ```js
 * var myIcon = L.divIcon({className: 'my-div-icon'});
 * // you can set .my-div-icon styles in CSS
 *
 * L.marker([50.505, 30.57], {icon: myIcon}).addTo(map);
 * ```
 *
 * By default, it has a 'leaflet-div-icon' CSS class and is styled as a little white square with a shadow.
 */

var DivIcon = Icon.extend({
	options: {
		// @section
		// @aka DivIcon options
		iconSize: [12, 12], // also can be set through CSS

		// iconAnchor: (Point),
		// popupAnchor: (Point),

		// @option html: String = ''
		// Custom HTML code to put inside the div element, empty by default.
		html: false,

		// @option bgPos: Point = [0, 0]
		// Optional relative position of the background, in pixels
		bgPos: null,

		className: 'leaflet-div-icon'
	},

	createIcon: function (oldIcon) {
		var div = (oldIcon && oldIcon.tagName === 'DIV') ? oldIcon : document.createElement('div'),
		    options = this.options;

		div.innerHTML = options.html !== false ? options.html : '';

		if (options.bgPos) {
			var bgPos = toPoint(options.bgPos);
			div.style.backgroundPosition = (-bgPos.x) + 'px ' + (-bgPos.y) + 'px';
		}
		this._setIconStyles(div, 'icon');

		return div;
	},

	createShadow: function () {
		return null;
	}
});

// @factory L.divIcon(options: DivIcon options)
// Creates a `DivIcon` instance with the given options.
function divIcon(options) {
	return new DivIcon(options);
}

Icon.Default = IconDefault;

/*
 * @class GridLayer
 * @inherits Layer
 * @aka L.GridLayer
 *
 * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and replaces `TileLayer.Canvas`.
 * GridLayer can be extended to create a tiled grid of HTML elements like `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
 *
 *
 * @section Synchronous usage
 * @example
 *
 * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
 *
 * ```js
 * var CanvasLayer = L.GridLayer.extend({
 *     createTile: function(coords){
 *         // create a <canvas> element for drawing
 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         var size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
 *         var ctx = tile.getContext('2d');
 *
 *         // return the tile so it can be rendered on screen
 *         return tile;
 *     }
 * });
 * ```
 *
 * @section Asynchronous usage
 * @example
 *
 * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
 *
 * ```js
 * var CanvasLayer = L.GridLayer.extend({
 *     createTile: function(coords, done){
 *         var error;
 *
 *         // create a <canvas> element for drawing
 *         var tile = L.DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         var size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // draw something asynchronously and pass the tile to the done() callback
 *         setTimeout(function() {
 *             done(error, tile);
 *         }, 1000);
 *
 *         return tile;
 *     }
 * });
 * ```
 *
 * @section
 */


var GridLayer = Layer.extend({

	// @section
	// @aka GridLayer options
	options: {
		// @option tileSize: Number|Point = 256
		// Width and height of tiles in the grid. Use a number if width and height are equal, or `L.point(width, height)` otherwise.
		tileSize: 256,

		// @option opacity: Number = 1.0
		// Opacity of the tiles. Can be used in the `createTile()` function.
		opacity: 1,

		// @option updateWhenIdle: Boolean = (depends)
		// Load new tiles only when panning ends.
		// `true` by default on mobile browsers, in order to avoid too many requests and keep smooth navigation.
		// `false` otherwise in order to display new tiles _during_ panning, since it is easy to pan outside the
		// [`keepBuffer`](#gridlayer-keepbuffer) option in desktop browsers.
		updateWhenIdle: mobile,

		// @option updateWhenZooming: Boolean = true
		// By default, a smooth zoom animation (during a [touch zoom](#map-touchzoom) or a [`flyTo()`](#map-flyto)) will update grid layers every integer zoom level. Setting this option to `false` will update the grid layer only when the smooth animation ends.
		updateWhenZooming: true,

		// @option updateInterval: Number = 200
		// Tiles will not update more than once every `updateInterval` milliseconds when panning.
		updateInterval: 200,

		// @option zIndex: Number = 1
		// The explicit zIndex of the tile layer.
		zIndex: 1,

		// @option bounds: LatLngBounds = undefined
		// If set, tiles will only be loaded inside the set `LatLngBounds`.
		bounds: null,

		// @option minZoom: Number = 0
		// The minimum zoom level down to which this layer will be displayed (inclusive).
		minZoom: 0,

		// @option maxZoom: Number = undefined
		// The maximum zoom level up to which this layer will be displayed (inclusive).
		maxZoom: undefined,

		// @option maxNativeZoom: Number = undefined
		// Maximum zoom number the tile source has available. If it is specified,
		// the tiles on all zoom levels higher than `maxNativeZoom` will be loaded
		// from `maxNativeZoom` level and auto-scaled.
		maxNativeZoom: undefined,

		// @option minNativeZoom: Number = undefined
		// Minimum zoom number the tile source has available. If it is specified,
		// the tiles on all zoom levels lower than `minNativeZoom` will be loaded
		// from `minNativeZoom` level and auto-scaled.
		minNativeZoom: undefined,

		// @option noWrap: Boolean = false
		// Whether the layer is wrapped around the antimeridian. If `true`, the
		// GridLayer will only be displayed once at low zoom levels. Has no
		// effect when the [map CRS](#map-crs) doesn't wrap around. Can be used
		// in combination with [`bounds`](#gridlayer-bounds) to prevent requesting
		// tiles outside the CRS limits.
		noWrap: false,

		// @option pane: String = 'tilePane'
		// `Map pane` where the grid layer will be added.
		pane: 'tilePane',

		// @option className: String = ''
		// A custom class name to assign to the tile layer. Empty by default.
		className: '',

		// @option keepBuffer: Number = 2
		// When panning the map, keep this many rows and columns of tiles before unloading them.
		keepBuffer: 2
	},

	initialize: function (options) {
		setOptions(this, options);
	},

	onAdd: function () {
		this._initContainer();

		this._levels = {};
		this._tiles = {};

		this._resetView();
		this._update();
	},

	beforeAdd: function (map) {
		map._addZoomLimit(this);
	},

	onRemove: function (map) {
		this._removeAllTiles();
		remove(this._container);
		map._removeZoomLimit(this);
		this._container = null;
		this._tileZoom = undefined;
	},

	// @method bringToFront: this
	// Brings the tile layer to the top of all tile layers.
	bringToFront: function () {
		if (this._map) {
			toFront(this._container);
			this._setAutoZIndex(Math.max);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings the tile layer to the bottom of all tile layers.
	bringToBack: function () {
		if (this._map) {
			toBack(this._container);
			this._setAutoZIndex(Math.min);
		}
		return this;
	},

	// @method getContainer: HTMLElement
	// Returns the HTML element that contains the tiles for this layer.
	getContainer: function () {
		return this._container;
	},

	// @method setOpacity(opacity: Number): this
	// Changes the [opacity](#gridlayer-opacity) of the grid layer.
	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// @method setZIndex(zIndex: Number): this
	// Changes the [zIndex](#gridlayer-zindex) of the grid layer.
	setZIndex: function (zIndex) {
		this.options.zIndex = zIndex;
		this._updateZIndex();

		return this;
	},

	// @method isLoading: Boolean
	// Returns `true` if any tile in the grid layer has not finished loading.
	isLoading: function () {
		return this._loading;
	},

	// @method redraw: this
	// Causes the layer to clear all the tiles and request them again.
	redraw: function () {
		if (this._map) {
			this._removeAllTiles();
			this._update();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			viewprereset: this._invalidateAll,
			viewreset: this._resetView,
			zoom: this._resetView,
			moveend: this._onMoveEnd
		};

		if (!this.options.updateWhenIdle) {
			// update tiles on move, but not more often than once per given interval
			if (!this._onMove) {
				this._onMove = throttle(this._onMoveEnd, this.options.updateInterval, this);
			}

			events.move = this._onMove;
		}

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	// @section Extension methods
	// Layers extending `GridLayer` shall reimplement the following method.
	// @method createTile(coords: Object, done?: Function): HTMLElement
	// Called only internally, must be overridden by classes extending `GridLayer`.
	// Returns the `HTMLElement` corresponding to the given `coords`. If the `done` callback
	// is specified, it must be called when the tile has finished loading and drawing.
	createTile: function () {
		return document.createElement('div');
	},

	// @section
	// @method getTileSize: Point
	// Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method.
	getTileSize: function () {
		var s = this.options.tileSize;
		return s instanceof Point ? s : new Point(s, s);
	},

	_updateZIndex: function () {
		if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._container.style.zIndex = this.options.zIndex;
		}
	},

	_setAutoZIndex: function (compare) {
		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

		var layers = this.getPane().children,
		    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

		for (var i = 0, len = layers.length, zIndex; i < len; i++) {

			zIndex = layers[i].style.zIndex;

			if (layers[i] !== this._container && zIndex) {
				edgeZIndex = compare(edgeZIndex, +zIndex);
			}
		}

		if (isFinite(edgeZIndex)) {
			this.options.zIndex = edgeZIndex + compare(-1, 1);
			this._updateZIndex();
		}
	},

	_updateOpacity: function () {
		if (!this._map) { return; }

		// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
		if (ielt9) { return; }

		setOpacity(this._container, this.options.opacity);

		var now = +new Date(),
		    nextFrame = false,
		    willPrune = false;

		for (var key in this._tiles) {
			var tile = this._tiles[key];
			if (!tile.current || !tile.loaded) { continue; }

			var fade = Math.min(1, (now - tile.loaded) / 200);

			setOpacity(tile.el, fade);
			if (fade < 1) {
				nextFrame = true;
			} else {
				if (tile.active) {
					willPrune = true;
				} else {
					this._onOpaqueTile(tile);
				}
				tile.active = true;
			}
		}

		if (willPrune && !this._noPrune) { this._pruneTiles(); }

		if (nextFrame) {
			cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
		}
	},

	_onOpaqueTile: falseFn,

	_initContainer: function () {
		if (this._container) { return; }

		this._container = create$1('div', 'leaflet-layer ' + (this.options.className || ''));
		this._updateZIndex();

		if (this.options.opacity < 1) {
			this._updateOpacity();
		}

		this.getPane().appendChild(this._container);
	},

	_updateLevels: function () {

		var zoom = this._tileZoom,
		    maxZoom = this.options.maxZoom;

		if (zoom === undefined) { return undefined; }

		for (var z in this._levels) {
			if (this._levels[z].el.children.length || z === zoom) {
				this._levels[z].el.style.zIndex = maxZoom - Math.abs(zoom - z);
				this._onUpdateLevel(z);
			} else {
				remove(this._levels[z].el);
				this._removeTilesAtZoom(z);
				this._onRemoveLevel(z);
				delete this._levels[z];
			}
		}

		var level = this._levels[zoom],
		    map = this._map;

		if (!level) {
			level = this._levels[zoom] = {};

			level.el = create$1('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
			level.el.style.zIndex = maxZoom;

			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
			level.zoom = zoom;

			this._setZoomTransform(level, map.getCenter(), map.getZoom());

			// force the browser to consider the newly added element for transition
			falseFn(level.el.offsetWidth);

			this._onCreateLevel(level);
		}

		this._level = level;

		return level;
	},

	_onUpdateLevel: falseFn,

	_onRemoveLevel: falseFn,

	_onCreateLevel: falseFn,

	_pruneTiles: function () {
		if (!this._map) {
			return;
		}

		var key, tile;

		var zoom = this._map.getZoom();
		if (zoom > this.options.maxZoom ||
			zoom < this.options.minZoom) {
			this._removeAllTiles();
			return;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			tile.retain = tile.current;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			if (tile.current && !tile.active) {
				var coords = tile.coords;
				if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
					this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
				}
			}
		}

		for (key in this._tiles) {
			if (!this._tiles[key].retain) {
				this._removeTile(key);
			}
		}
	},

	_removeTilesAtZoom: function (zoom) {
		for (var key in this._tiles) {
			if (this._tiles[key].coords.z !== zoom) {
				continue;
			}
			this._removeTile(key);
		}
	},

	_removeAllTiles: function () {
		for (var key in this._tiles) {
			this._removeTile(key);
		}
	},

	_invalidateAll: function () {
		for (var z in this._levels) {
			remove(this._levels[z].el);
			this._onRemoveLevel(z);
			delete this._levels[z];
		}
		this._removeAllTiles();

		this._tileZoom = undefined;
	},

	_retainParent: function (x, y, z, minZoom) {
		var x2 = Math.floor(x / 2),
		    y2 = Math.floor(y / 2),
		    z2 = z - 1,
		    coords2 = new Point(+x2, +y2);
		coords2.z = +z2;

		var key = this._tileCoordsToKey(coords2),
		    tile = this._tiles[key];

		if (tile && tile.active) {
			tile.retain = true;
			return true;

		} else if (tile && tile.loaded) {
			tile.retain = true;
		}

		if (z2 > minZoom) {
			return this._retainParent(x2, y2, z2, minZoom);
		}

		return false;
	},

	_retainChildren: function (x, y, z, maxZoom) {

		for (var i = 2 * x; i < 2 * x + 2; i++) {
			for (var j = 2 * y; j < 2 * y + 2; j++) {

				var coords = new Point(i, j);
				coords.z = z + 1;

				var key = this._tileCoordsToKey(coords),
				    tile = this._tiles[key];

				if (tile && tile.active) {
					tile.retain = true;
					continue;

				} else if (tile && tile.loaded) {
					tile.retain = true;
				}

				if (z + 1 < maxZoom) {
					this._retainChildren(i, j, z + 1, maxZoom);
				}
			}
		}
	},

	_resetView: function (e) {
		var animating = e && (e.pinch || e.flyTo);
		this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
	},

	_animateZoom: function (e) {
		this._setView(e.center, e.zoom, true, e.noUpdate);
	},

	_clampZoom: function (zoom) {
		var options = this.options;

		if (undefined !== options.minNativeZoom && zoom < options.minNativeZoom) {
			return options.minNativeZoom;
		}

		if (undefined !== options.maxNativeZoom && options.maxNativeZoom < zoom) {
			return options.maxNativeZoom;
		}

		return zoom;
	},

	_setView: function (center, zoom, noPrune, noUpdate) {
		var tileZoom = this._clampZoom(Math.round(zoom));
		if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
		    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
			tileZoom = undefined;
		}

		var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

		if (!noUpdate || tileZoomChanged) {

			this._tileZoom = tileZoom;

			if (this._abortLoading) {
				this._abortLoading();
			}

			this._updateLevels();
			this._resetGrid();

			if (tileZoom !== undefined) {
				this._update(center);
			}

			if (!noPrune) {
				this._pruneTiles();
			}

			// Flag to prevent _updateOpacity from pruning tiles during
			// a zoom anim or a pinch gesture
			this._noPrune = !!noPrune;
		}

		this._setZoomTransforms(center, zoom);
	},

	_setZoomTransforms: function (center, zoom) {
		for (var i in this._levels) {
			this._setZoomTransform(this._levels[i], center, zoom);
		}
	},

	_setZoomTransform: function (level, center, zoom) {
		var scale = this._map.getZoomScale(zoom, level.zoom),
		    translate = level.origin.multiplyBy(scale)
		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		if (any3d) {
			setTransform(level.el, translate, scale);
		} else {
			setPosition(level.el, translate);
		}
	},

	_resetGrid: function () {
		var map = this._map,
		    crs = map.options.crs,
		    tileSize = this._tileSize = this.getTileSize(),
		    tileZoom = this._tileZoom;

		var bounds = this._map.getPixelWorldBounds(this._tileZoom);
		if (bounds) {
			this._globalTileRange = this._pxBoundsToTileRange(bounds);
		}

		this._wrapX = crs.wrapLng && !this.options.noWrap && [
			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.y)
		];
		this._wrapY = crs.wrapLat && !this.options.noWrap && [
			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.x),
			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
		];
	},

	_onMoveEnd: function () {
		if (!this._map || this._map._animatingZoom) { return; }

		this._update();
	},

	_getTiledPixelBounds: function (center) {
		var map = this._map,
		    mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
		    scale = map.getZoomScale(mapZoom, this._tileZoom),
		    pixelCenter = map.project(center, this._tileZoom).floor(),
		    halfSize = map.getSize().divideBy(scale * 2);

		return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
	},

	// Private method to load tiles in the grid's active zoom level according to map bounds
	_update: function (center) {
		var map = this._map;
		if (!map) { return; }
		var zoom = this._clampZoom(map.getZoom());

		if (center === undefined) { center = map.getCenter(); }
		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

		var pixelBounds = this._getTiledPixelBounds(center),
		    tileRange = this._pxBoundsToTileRange(pixelBounds),
		    tileCenter = tileRange.getCenter(),
		    queue = [],
		    margin = this.options.keepBuffer,
		    noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
		                              tileRange.getTopRight().add([margin, -margin]));

		// Sanity check: panic if the tile range contains Infinity somewhere.
		if (!(isFinite(tileRange.min.x) &&
		      isFinite(tileRange.min.y) &&
		      isFinite(tileRange.max.x) &&
		      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

		for (var key in this._tiles) {
			var c = this._tiles[key].coords;
			if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
				this._tiles[key].current = false;
			}
		}

		// _update just loads more tiles. If the tile zoom level differs too much
		// from the map's, let _setView reset levels and prune old tiles.
		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

		// create a queue of coordinates to load tiles from
		for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
			for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
				var coords = new Point(i, j);
				coords.z = this._tileZoom;

				if (!this._isValidTile(coords)) { continue; }

				var tile = this._tiles[this._tileCoordsToKey(coords)];
				if (tile) {
					tile.current = true;
				} else {
					queue.push(coords);
				}
			}
		}

		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
		});

		if (queue.length !== 0) {
			// if it's the first batch of tiles to load
			if (!this._loading) {
				this._loading = true;
				// @event loading: Event
				// Fired when the grid layer starts loading tiles.
				this.fire('loading');
			}

			// create DOM fragment to append tiles in one batch
			var fragment = document.createDocumentFragment();

			for (i = 0; i < queue.length; i++) {
				this._addTile(queue[i], fragment);
			}

			this._level.el.appendChild(fragment);
		}
	},

	_isValidTile: function (coords) {
		var crs = this._map.options.crs;

		if (!crs.infinite) {
			// don't load tile if it's out of bounds and not wrapped
			var bounds = this._globalTileRange;
			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
		}

		if (!this.options.bounds) { return true; }

		// don't load tile if it doesn't intersect the bounds in options
		var tileBounds = this._tileCoordsToBounds(coords);
		return toLatLngBounds(this.options.bounds).overlaps(tileBounds);
	},

	_keyToBounds: function (key) {
		return this._tileCoordsToBounds(this._keyToTileCoords(key));
	},

	_tileCoordsToNwSe: function (coords) {
		var map = this._map,
		    tileSize = this.getTileSize(),
		    nwPoint = coords.scaleBy(tileSize),
		    sePoint = nwPoint.add(tileSize),
		    nw = map.unproject(nwPoint, coords.z),
		    se = map.unproject(sePoint, coords.z);
		return [nw, se];
	},

	// converts tile coordinates to its geographical bounds
	_tileCoordsToBounds: function (coords) {
		var bp = this._tileCoordsToNwSe(coords),
		    bounds = new LatLngBounds(bp[0], bp[1]);

		if (!this.options.noWrap) {
			bounds = this._map.wrapLatLngBounds(bounds);
		}
		return bounds;
	},
	// converts tile coordinates to key for the tile cache
	_tileCoordsToKey: function (coords) {
		return coords.x + ':' + coords.y + ':' + coords.z;
	},

	// converts tile cache key to coordinates
	_keyToTileCoords: function (key) {
		var k = key.split(':'),
		    coords = new Point(+k[0], +k[1]);
		coords.z = +k[2];
		return coords;
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];
		if (!tile) { return; }

		// Cancels any pending http requests associated with the tile
		// unless we're on Android's stock browser,
		// see https://github.com/Leaflet/Leaflet/issues/137
		if (!androidStock) {
			tile.el.setAttribute('src', emptyImageUrl);
		}
		remove(tile.el);

		delete this._tiles[key];

		// @event tileunload: TileEvent
		// Fired when a tile is removed (e.g. when a tile goes off the screen).
		this.fire('tileunload', {
			tile: tile.el,
			coords: this._keyToTileCoords(key)
		});
	},

	_initTile: function (tile) {
		addClass(tile, 'leaflet-tile');

		var tileSize = this.getTileSize();
		tile.style.width = tileSize.x + 'px';
		tile.style.height = tileSize.y + 'px';

		tile.onselectstart = falseFn;
		tile.onmousemove = falseFn;

		// update opacity on tiles in IE7-8 because of filter inheritance problems
		if (ielt9 && this.options.opacity < 1) {
			setOpacity(tile, this.options.opacity);
		}

		// without this hack, tiles disappear after zoom on Chrome for Android
		// https://github.com/Leaflet/Leaflet/issues/2078
		if (android && !android23) {
			tile.style.WebkitBackfaceVisibility = 'hidden';
		}
	},

	_addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords),
		    key = this._tileCoordsToKey(coords);

		var tile = this.createTile(this._wrapCoords(coords), bind(this._tileReady, this, coords));

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
			requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
		}

		setPosition(tile, tilePos);

		// save tile in cache
		this._tiles[key] = {
			el: tile,
			coords: coords,
			current: true
		};

		container.appendChild(tile);
		// @event tileloadstart: TileEvent
		// Fired when a tile is requested and starts loading.
		this.fire('tileloadstart', {
			tile: tile,
			coords: coords
		});
	},

	_tileReady: function (coords, err, tile) {
		if (!this._map) { return; }

		if (err) {
			// @event tileerror: TileErrorEvent
			// Fired when there is an error loading a tile.
			this.fire('tileerror', {
				error: err,
				tile: tile,
				coords: coords
			});
		}

		var key = this._tileCoordsToKey(coords);

		tile = this._tiles[key];
		if (!tile) { return; }

		tile.loaded = +new Date();
		if (this._map._fadeAnimated) {
			setOpacity(tile.el, 0);
			cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = requestAnimFrame(this._updateOpacity, this);
		} else {
			tile.active = true;
			this._pruneTiles();
		}

		if (!err) {
			addClass(tile.el, 'leaflet-tile-loaded');

			// @event tileload: TileEvent
			// Fired when a tile loads.
			this.fire('tileload', {
				tile: tile.el,
				coords: coords
			});
		}

		if (this._noTilesToLoad()) {
			this._loading = false;
			// @event load: Event
			// Fired when the grid layer loaded all visible tiles.
			this.fire('load');

			if (ielt9 || !this._map._fadeAnimated) {
				requestAnimFrame(this._pruneTiles, this);
			} else {
				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
				// to trigger a pruning.
				setTimeout(bind(this._pruneTiles, this), 250);
			}
		}
	},

	_getTilePos: function (coords) {
		return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
	},

	_wrapCoords: function (coords) {
		var newCoords = new Point(
			this._wrapX ? wrapNum(coords.x, this._wrapX) : coords.x,
			this._wrapY ? wrapNum(coords.y, this._wrapY) : coords.y);
		newCoords.z = coords.z;
		return newCoords;
	},

	_pxBoundsToTileRange: function (bounds) {
		var tileSize = this.getTileSize();
		return new Bounds(
			bounds.min.unscaleBy(tileSize).floor(),
			bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
	},

	_noTilesToLoad: function () {
		for (var key in this._tiles) {
			if (!this._tiles[key].loaded) { return false; }
		}
		return true;
	}
});

// @factory L.gridLayer(options?: GridLayer options)
// Creates a new instance of GridLayer with the supplied options.
function gridLayer(options) {
	return new GridLayer(options);
}

/*
 * @class TileLayer
 * @inherits GridLayer
 * @aka L.TileLayer
 * Used to load and display tile layers on the map. Extends `GridLayer`.
 *
 * @example
 *
 * ```js
 * L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar'}).addTo(map);
 * ```
 *
 * @section URL template
 * @example
 *
 * A string of the following form:
 *
 * ```
 * 'http://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
 * ```
 *
 * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` — zoom level, `{x}` and `{y}` — tile coordinates. `{r}` can be used to add "&commat;2x" to the URL to load retina tiles.
 *
 * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
 *
 * ```
 * L.tileLayer('http://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
 * ```
 */


var TileLayer = GridLayer.extend({

	// @section
	// @aka TileLayer options
	options: {
		// @option minZoom: Number = 0
		// The minimum zoom level down to which this layer will be displayed (inclusive).
		minZoom: 0,

		// @option maxZoom: Number = 18
		// The maximum zoom level up to which this layer will be displayed (inclusive).
		maxZoom: 18,

		// @option subdomains: String|String[] = 'abc'
		// Subdomains of the tile service. Can be passed in the form of one string (where each letter is a subdomain name) or an array of strings.
		subdomains: 'abc',

		// @option errorTileUrl: String = ''
		// URL to the tile image to show in place of the tile that failed to load.
		errorTileUrl: '',

		// @option zoomOffset: Number = 0
		// The zoom number used in tile URLs will be offset with this value.
		zoomOffset: 0,

		// @option tms: Boolean = false
		// If `true`, inverses Y axis numbering for tiles (turn this on for [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
		tms: false,

		// @option zoomReverse: Boolean = false
		// If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`)
		zoomReverse: false,

		// @option detectRetina: Boolean = false
		// If `true` and user is on a retina display, it will request four tiles of half the specified size and a bigger zoom level in place of one to utilize the high resolution.
		detectRetina: false,

		// @option crossOrigin: Boolean = false
		// If true, all tiles will have their crossOrigin attribute set to ''. This is needed if you want to access tile pixel data.
		crossOrigin: false
	},

	initialize: function (url, options) {

		this._url = url;

		options = setOptions(this, options);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (options.detectRetina && retina && options.maxZoom > 0) {

			options.tileSize = Math.floor(options.tileSize / 2);

			if (!options.zoomReverse) {
				options.zoomOffset++;
				options.maxZoom--;
			} else {
				options.zoomOffset--;
				options.minZoom++;
			}

			options.minZoom = Math.max(0, options.minZoom);
		}

		if (typeof options.subdomains === 'string') {
			options.subdomains = options.subdomains.split('');
		}

		// for https://github.com/Leaflet/Leaflet/issues/137
		if (!android) {
			this.on('tileunload', this._onTileRemove);
		}
	},

	// @method setUrl(url: String, noRedraw?: Boolean): this
	// Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`).
	setUrl: function (url, noRedraw) {
		this._url = url;

		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	// @method createTile(coords: Object, done?: Function): HTMLElement
	// Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
	// to return an `<img>` HTML element with the appropriate image URL given `coords`. The `done`
	// callback is called when the tile has been loaded.
	createTile: function (coords, done) {
		var tile = document.createElement('img');

		on(tile, 'load', bind(this._tileOnLoad, this, done, tile));
		on(tile, 'error', bind(this._tileOnError, this, done, tile));

		if (this.options.crossOrigin) {
			tile.crossOrigin = '';
		}

		/*
		 Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
		 http://www.w3.org/TR/WCAG20-TECHS/H67
		*/
		tile.alt = '';

		/*
		 Set role="presentation" to force screen readers to ignore this
		 https://www.w3.org/TR/wai-aria/roles#textalternativecomputation
		*/
		tile.setAttribute('role', 'presentation');

		tile.src = this.getTileUrl(coords);

		return tile;
	},

	// @section Extension methods
	// @uninheritable
	// Layers extending `TileLayer` might reimplement the following method.
	// @method getTileUrl(coords: Object): String
	// Called only internally, returns the URL for a tile given its coordinates.
	// Classes extending `TileLayer` can override this function to provide custom tile URL naming schemes.
	getTileUrl: function (coords) {
		var data = {
			r: retina ? '@2x' : '',
			s: this._getSubdomain(coords),
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl()
		};
		if (this._map && !this._map.options.crs.infinite) {
			var invertedY = this._globalTileRange.max.y - coords.y;
			if (this.options.tms) {
				data['y'] = invertedY;
			}
			data['-y'] = invertedY;
		}

		return template(this._url, extend(data, this.options));
	},

	_tileOnLoad: function (done, tile) {
		// For https://github.com/Leaflet/Leaflet/issues/3332
		if (ielt9) {
			setTimeout(bind(done, this, null, tile), 0);
		} else {
			done(null, tile);
		}
	},

	_tileOnError: function (done, tile, e) {
		var errorUrl = this.options.errorTileUrl;
		if (errorUrl && tile.getAttribute('src') !== errorUrl) {
			tile.src = errorUrl;
		}
		done(e, tile);
	},

	_onTileRemove: function (e) {
		e.tile.onload = null;
	},

	_getZoomForUrl: function () {
		var zoom = this._tileZoom,
		maxZoom = this.options.maxZoom,
		zoomReverse = this.options.zoomReverse,
		zoomOffset = this.options.zoomOffset;

		if (zoomReverse) {
			zoom = maxZoom - zoom;
		}

		return zoom + zoomOffset;
	},

	_getSubdomain: function (tilePoint) {
		var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
		return this.options.subdomains[index];
	},

	// stops loading all tiles in the background layer
	_abortLoading: function () {
		var i, tile;
		for (i in this._tiles) {
			if (this._tiles[i].coords.z !== this._tileZoom) {
				tile = this._tiles[i].el;

				tile.onload = falseFn;
				tile.onerror = falseFn;

				if (!tile.complete) {
					tile.src = emptyImageUrl;
					remove(tile);
					delete this._tiles[i];
				}
			}
		}
	}
});


// @factory L.tilelayer(urlTemplate: String, options?: TileLayer options)
// Instantiates a tile layer object given a `URL template` and optionally an options object.

function tileLayer(url, options) {
	return new TileLayer(url, options);
}

/*
 * @class TileLayer.WMS
 * @inherits TileLayer
 * @aka L.TileLayer.WMS
 * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
 *
 * @example
 *
 * ```js
 * var nexrad = L.tileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
 * 	layers: 'nexrad-n0r-900913',
 * 	format: 'image/png',
 * 	transparent: true,
 * 	attribution: "Weather data © 2012 IEM Nexrad"
 * });
 * ```
 */

var TileLayerWMS = TileLayer.extend({

	// @section
	// @aka TileLayer.WMS options
	// If any custom options not documented here are used, they will be sent to the
	// WMS server as extra parameters in each request URL. This can be useful for
	// [non-standard vendor WMS parameters](http://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',

		// @option layers: String = ''
		// **(required)** Comma-separated list of WMS layers to show.
		layers: '',

		// @option styles: String = ''
		// Comma-separated list of WMS styles.
		styles: '',

		// @option format: String = 'image/jpeg'
		// WMS image format (use `'image/png'` for layers with transparency).
		format: 'image/jpeg',

		// @option transparent: Boolean = false
		// If `true`, the WMS service will return images with transparency.
		transparent: false,

		// @option version: String = '1.1.1'
		// Version of the WMS service to use
		version: '1.1.1'
	},

	options: {
		// @option crs: CRS = null
		// Coordinate Reference System to use for the WMS requests, defaults to
		// map CRS. Don't change this if you're not sure what it means.
		crs: null,

		// @option uppercase: Boolean = false
		// If `true`, WMS request parameter keys will be uppercase.
		uppercase: false
	},

	initialize: function (url, options) {

		this._url = url;

		var wmsParams = extend({}, this.defaultWmsParams);

		// all keys that are not TileLayer options go to WMS params
		for (var i in options) {
			if (!(i in this.options)) {
				wmsParams[i] = options[i];
			}
		}

		options = setOptions(this, options);

		var realRetina = options.detectRetina && retina ? 2 : 1;
		var tileSize = this.getTileSize();
		wmsParams.width = tileSize.x * realRetina;
		wmsParams.height = tileSize.y * realRetina;

		this.wmsParams = wmsParams;
	},

	onAdd: function (map) {

		this._crs = this.options.crs || map.options.crs;
		this._wmsVersion = parseFloat(this.wmsParams.version);

		var projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = this._crs.code;

		TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl: function (coords) {

		var tileBounds = this._tileCoordsToNwSe(coords),
		    crs = this._crs,
		    bounds = toBounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])),
		    min = bounds.min,
		    max = bounds.max,
		    bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ?
		    [min.y, min.x, max.y, max.x] :
		    [min.x, min.y, max.x, max.y]).join(','),
		url = L.TileLayer.prototype.getTileUrl.call(this, coords);
		return url +
			getParamString(this.wmsParams, url, this.options.uppercase) +
			(this.options.uppercase ? '&BBOX=' : '&bbox=') + bbox;
	},

	// @method setParams(params: Object, noRedraw?: Boolean): this
	// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
	setParams: function (params, noRedraw) {

		extend(this.wmsParams, params);

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
});


// @factory L.tileLayer.wms(baseUrl: String, options: TileLayer.WMS options)
// Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
function tileLayerWMS(url, options) {
	return new TileLayerWMS(url, options);
}

TileLayer.WMS = TileLayerWMS;
tileLayer.wms = tileLayerWMS;

/*
 * @class Renderer
 * @inherits Layer
 * @aka L.Renderer
 *
 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
 * DOM container of the renderer, its bounds, and its zoom animation.
 *
 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
 * itself can be added or removed to the map. All paths use a renderer, which can
 * be implicit (the map will decide the type of renderer and use it automatically)
 * or explicit (using the [`renderer`](#path-renderer) option of the path).
 *
 * Do not use this class directly, use `SVG` and `Canvas` instead.
 *
 * @event update: Event
 * Fired when the renderer updates its bounds, center and zoom, for example when
 * its map has moved
 */

var Renderer = Layer.extend({

	// @section
	// @aka Renderer options
	options: {
		// @option padding: Number = 0.1
		// How much to extend the clip area around the map view (relative to its size)
		// e.g. 0.1 would be 10% of map view in each direction
		padding: 0.1,

		// @option tolerance: Number = 0
		// How much to extend click tolerance round a path/object on the map
		tolerance : 0
	},

	initialize: function (options) {
		setOptions(this, options);
		stamp(this);
		this._layers = this._layers || {};
	},

	onAdd: function () {
		if (!this._container) {
			this._initContainer(); // defined by renderer implementations

			if (this._zoomAnimated) {
				addClass(this._container, 'leaflet-zoom-animated');
			}
		}

		this.getPane().appendChild(this._container);
		this._update();
		this.on('update', this._updatePaths, this);
	},

	onRemove: function () {
		this.off('update', this._updatePaths, this);
		this._destroyContainer();
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset,
			zoom: this._onZoom,
			moveend: this._update,
			zoomend: this._onZoomEnd
		};
		if (this._zoomAnimated) {
			events.zoomanim = this._onAnimZoom;
		}
		return events;
	},

	_onAnimZoom: function (ev) {
		this._updateTransform(ev.center, ev.zoom);
	},

	_onZoom: function () {
		this._updateTransform(this._map.getCenter(), this._map.getZoom());
	},

	_updateTransform: function (center, zoom) {
		var scale = this._map.getZoomScale(zoom, this._zoom),
		    position = getPosition(this._container),
		    viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
		    currentCenterPoint = this._map.project(this._center, zoom),
		    destCenterPoint = this._map.project(center, zoom),
		    centerOffset = destCenterPoint.subtract(currentCenterPoint),

		    topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

		if (any3d) {
			setTransform(this._container, topLeftOffset, scale);
		} else {
			setPosition(this._container, topLeftOffset);
		}
	},

	_reset: function () {
		this._update();
		this._updateTransform(this._center, this._zoom);

		for (var id in this._layers) {
			this._layers[id]._reset();
		}
	},

	_onZoomEnd: function () {
		for (var id in this._layers) {
			this._layers[id]._project();
		}
	},

	_updatePaths: function () {
		for (var id in this._layers) {
			this._layers[id]._update();
		}
	},

	_update: function () {
		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
		// Subclasses are responsible of firing the 'update' event.
		var p = this.options.padding,
		    size = this._map.getSize(),
		    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

		this._center = this._map.getCenter();
		this._zoom = this._map.getZoom();
	}
});

/*
 * @class Canvas
 * @inherits Renderer
 * @aka L.Canvas
 *
 * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
 * Inherits `Renderer`.
 *
 * Due to [technical limitations](http://caniuse.com/#search=canvas), Canvas is not
 * available in all web browsers, notably IE8, and overlapping geometries might
 * not display properly in some edge cases.
 *
 * @example
 *
 * Use Canvas by default for all paths in the map:
 *
 * ```js
 * var map = L.map('map', {
 * 	renderer: L.canvas()
 * });
 * ```
 *
 * Use a Canvas renderer with extra padding for specific vector geometries:
 *
 * ```js
 * var map = L.map('map');
 * var myRenderer = L.canvas({ padding: 0.5 });
 * var line = L.polyline( coordinates, { renderer: myRenderer } );
 * var circle = L.circle( center, { renderer: myRenderer } );
 * ```
 */

var Canvas = Renderer.extend({
	getEvents: function () {
		var events = Renderer.prototype.getEvents.call(this);
		events.viewprereset = this._onViewPreReset;
		return events;
	},

	_onViewPreReset: function () {
		// Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
		this._postponeUpdatePaths = true;
	},

	onAdd: function () {
		Renderer.prototype.onAdd.call(this);

		// Redraw vectors since canvas is cleared upon removal,
		// in case of removing the renderer itself from the map.
		this._draw();
	},

	_initContainer: function () {
		var container = this._container = document.createElement('canvas');

		on(container, 'mousemove', throttle(this._onMouseMove, 32, this), this);
		on(container, 'click dblclick mousedown mouseup contextmenu', this._onClick, this);
		on(container, 'mouseout', this._handleMouseOut, this);

		this._ctx = container.getContext('2d');
	},

	_destroyContainer: function () {
		delete this._ctx;
		remove(this._container);
		off(this._container);
		delete this._container;
	},

	_updatePaths: function () {
		if (this._postponeUpdatePaths) { return; }

		var layer;
		this._redrawBounds = null;
		for (var id in this._layers) {
			layer = this._layers[id];
			layer._update();
		}
		this._redraw();
	},

	_update: function () {
		if (this._map._animatingZoom && this._bounds) { return; }

		this._drawnLayers = {};

		Renderer.prototype._update.call(this);

		var b = this._bounds,
		    container = this._container,
		    size = b.getSize(),
		    m = retina ? 2 : 1;

		setPosition(container, b.min);

		// set canvas size (also clearing it); use double size on retina
		container.width = m * size.x;
		container.height = m * size.y;
		container.style.width = size.x + 'px';
		container.style.height = size.y + 'px';

		if (retina) {
			this._ctx.scale(2, 2);
		}

		// translate so we use the same path coordinates after canvas element moves
		this._ctx.translate(-b.min.x, -b.min.y);

		// Tell paths to redraw themselves
		this.fire('update');
	},

	_reset: function () {
		Renderer.prototype._reset.call(this);

		if (this._postponeUpdatePaths) {
			this._postponeUpdatePaths = false;
			this._updatePaths();
		}
	},

	_initPath: function (layer) {
		this._updateDashArray(layer);
		this._layers[stamp(layer)] = layer;

		var order = layer._order = {
			layer: layer,
			prev: this._drawLast,
			next: null
		};
		if (this._drawLast) { this._drawLast.next = order; }
		this._drawLast = order;
		this._drawFirst = this._drawFirst || this._drawLast;
	},

	_addPath: function (layer) {
		this._requestRedraw(layer);
	},

	_removePath: function (layer) {
		var order = layer._order;
		var next = order.next;
		var prev = order.prev;

		if (next) {
			next.prev = prev;
		} else {
			this._drawLast = prev;
		}
		if (prev) {
			prev.next = next;
		} else {
			this._drawFirst = next;
		}

		delete layer._order;

		delete this._layers[L.stamp(layer)];

		this._requestRedraw(layer);
	},

	_updatePath: function (layer) {
		// Redraw the union of the layer's old pixel
		// bounds and the new pixel bounds.
		this._extendRedrawBounds(layer);
		layer._project();
		layer._update();
		// The redraw will extend the redraw bounds
		// with the new pixel bounds.
		this._requestRedraw(layer);
	},

	_updateStyle: function (layer) {
		this._updateDashArray(layer);
		this._requestRedraw(layer);
	},

	_updateDashArray: function (layer) {
		if (layer.options.dashArray) {
			var parts = layer.options.dashArray.split(','),
			    dashArray = [],
			    i;
			for (i = 0; i < parts.length; i++) {
				dashArray.push(Number(parts[i]));
			}
			layer.options._dashArray = dashArray;
		}
	},

	_requestRedraw: function (layer) {
		if (!this._map) { return; }

		this._extendRedrawBounds(layer);
		this._redrawRequest = this._redrawRequest || requestAnimFrame(this._redraw, this);
	},

	_extendRedrawBounds: function (layer) {
		if (layer._pxBounds) {
			var padding = (layer.options.weight || 0) + 1;
			this._redrawBounds = this._redrawBounds || new Bounds();
			this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
			this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
		}
	},

	_redraw: function () {
		this._redrawRequest = null;

		if (this._redrawBounds) {
			this._redrawBounds.min._floor();
			this._redrawBounds.max._ceil();
		}

		this._clear(); // clear layers in redraw bounds
		this._draw(); // draw layers

		this._redrawBounds = null;
	},

	_clear: function () {
		var bounds = this._redrawBounds;
		if (bounds) {
			var size = bounds.getSize();
			this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
		} else {
			this._ctx.clearRect(0, 0, this._container.width, this._container.height);
		}
	},

	_draw: function () {
		var layer, bounds = this._redrawBounds;
		this._ctx.save();
		if (bounds) {
			var size = bounds.getSize();
			this._ctx.beginPath();
			this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
			this._ctx.clip();
		}

		this._drawing = true;

		for (var order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (!bounds || (layer._pxBounds && layer._pxBounds.intersects(bounds))) {
				layer._updatePath();
			}
		}

		this._drawing = false;

		this._ctx.restore();  // Restore state before clipping.
	},

	_updatePoly: function (layer, closed) {
		if (!this._drawing) { return; }

		var i, j, len2, p,
		    parts = layer._parts,
		    len = parts.length,
		    ctx = this._ctx;

		if (!len) { return; }

		this._drawnLayers[layer._leaflet_id] = layer;

		ctx.beginPath();

		for (i = 0; i < len; i++) {
			for (j = 0, len2 = parts[i].length; j < len2; j++) {
				p = parts[i][j];
				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
			}
			if (closed) {
				ctx.closePath();
			}
		}

		this._fillStroke(ctx, layer);

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_updateCircle: function (layer) {

		if (!this._drawing || layer._empty()) { return; }

		var p = layer._point,
		    ctx = this._ctx,
		    r = Math.max(Math.round(layer._radius), 1),
		    s = (Math.max(Math.round(layer._radiusY), 1) || r) / r;

		this._drawnLayers[layer._leaflet_id] = layer;

		if (s !== 1) {
			ctx.save();
			ctx.scale(1, s);
		}

		ctx.beginPath();
		ctx.arc(p.x, p.y / s, r, 0, Math.PI * 2, false);

		if (s !== 1) {
			ctx.restore();
		}

		this._fillStroke(ctx, layer);
	},

	_fillStroke: function (ctx, layer) {
		var options = layer.options;

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fillStyle = options.fillColor || options.color;
			ctx.fill(options.fillRule || 'evenodd');
		}

		if (options.stroke && options.weight !== 0) {
			if (ctx.setLineDash) {
				ctx.setLineDash(layer.options && layer.options._dashArray || []);
			}
			ctx.globalAlpha = options.opacity;
			ctx.lineWidth = options.weight;
			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke();
		}
	},

	// Canvas obviously doesn't have mouse events for individual drawn objects,
	// so we emulate that by calculating what's under the mouse on mousemove/click manually

	_onClick: function (e) {
		var point = this._map.mouseEventToLayerPoint(e), layer, clickedLayer;

		for (var order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (layer.options.interactive && layer._containsPoint(point) && !this._map._draggableMoved(layer)) {
				clickedLayer = layer;
			}
		}
		if (clickedLayer)  {
			fakeStop(e);
			this._fireEvent([clickedLayer], e);
		}
	},

	_onMouseMove: function (e) {
		if (!this._map || this._map.dragging.moving() || this._map._animatingZoom) { return; }

		var point = this._map.mouseEventToLayerPoint(e);
		this._handleMouseHover(e, point);
	},


	_handleMouseOut: function (e) {
		var layer = this._hoveredLayer;
		if (layer) {
			// if we're leaving the layer, fire mouseout
			removeClass(this._container, 'leaflet-interactive');
			this._fireEvent([layer], e, 'mouseout');
			this._hoveredLayer = null;
		}
	},

	_handleMouseHover: function (e, point) {
		var layer, candidateHoveredLayer;

		for (var order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (layer.options.interactive && layer._containsPoint(point)) {
				candidateHoveredLayer = layer;
			}
		}

		if (candidateHoveredLayer !== this._hoveredLayer) {
			this._handleMouseOut(e);

			if (candidateHoveredLayer) {
				addClass(this._container, 'leaflet-interactive'); // change cursor
				this._fireEvent([candidateHoveredLayer], e, 'mouseover');
				this._hoveredLayer = candidateHoveredLayer;
			}
		}

		if (this._hoveredLayer) {
			this._fireEvent([this._hoveredLayer], e);
		}
	},

	_fireEvent: function (layers, e, type) {
		this._map._fireDOMEvent(e, type || e.type, layers);
	},

	_bringToFront: function (layer) {
		var order = layer._order;
		var next = order.next;
		var prev = order.prev;

		if (next) {
			next.prev = prev;
		} else {
			// Already last
			return;
		}
		if (prev) {
			prev.next = next;
		} else if (next) {
			// Update first entry unless this is the
			// single entry
			this._drawFirst = next;
		}

		order.prev = this._drawLast;
		this._drawLast.next = order;

		order.next = null;
		this._drawLast = order;

		this._requestRedraw(layer);
	},

	_bringToBack: function (layer) {
		var order = layer._order;
		var next = order.next;
		var prev = order.prev;

		if (prev) {
			prev.next = next;
		} else {
			// Already first
			return;
		}
		if (next) {
			next.prev = prev;
		} else if (prev) {
			// Update last entry unless this is the
			// single entry
			this._drawLast = prev;
		}

		order.prev = null;

		order.next = this._drawFirst;
		this._drawFirst.prev = order;
		this._drawFirst = order;

		this._requestRedraw(layer);
	}
});

// @factory L.canvas(options?: Renderer options)
// Creates a Canvas renderer with the given options.
function canvas$1(options) {
	return canvas ? new Canvas(options) : null;
}

/*
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */


var vmlCreate = (function () {
	try {
		document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
		return function (name) {
			return document.createElement('<lvml:' + name + ' class="lvml">');
		};
	} catch (e) {
		return function (name) {
			return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
		};
	}
})();


/*
 * @class SVG
 *
 * Although SVG is not available on IE7 and IE8, these browsers support [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language), and the SVG renderer will fall back to VML in this case.
 *
 * VML was deprecated in 2012, which means VML functionality exists only for backwards compatibility
 * with old versions of Internet Explorer.
 */

// mixin to redefine some SVG methods to handle VML syntax which is similar but with some differences
var vmlMixin = {

	_initContainer: function () {
		this._container = create$1('div', 'leaflet-vml-container');
	},

	_update: function () {
		if (this._map._animatingZoom) { return; }
		Renderer.prototype._update.call(this);
		this.fire('update');
	},

	_initPath: function (layer) {
		var container = layer._container = vmlCreate('shape');

		addClass(container, 'leaflet-vml-shape ' + (this.options.className || ''));

		container.coordsize = '1 1';

		layer._path = vmlCreate('path');
		container.appendChild(layer._path);

		this._updateStyle(layer);
		this._layers[stamp(layer)] = layer;
	},

	_addPath: function (layer) {
		var container = layer._container;
		this._container.appendChild(container);

		if (layer.options.interactive) {
			layer.addInteractiveTarget(container);
		}
	},

	_removePath: function (layer) {
		var container = layer._container;
		remove(container);
		layer.removeInteractiveTarget(container);
		delete this._layers[stamp(layer)];
	},

	_updateStyle: function (layer) {
		var stroke = layer._stroke,
		    fill = layer._fill,
		    options = layer.options,
		    container = layer._container;

		container.stroked = !!options.stroke;
		container.filled = !!options.fill;

		if (options.stroke) {
			if (!stroke) {
				stroke = layer._stroke = vmlCreate('stroke');
			}
			container.appendChild(stroke);
			stroke.weight = options.weight + 'px';
			stroke.color = options.color;
			stroke.opacity = options.opacity;

			if (options.dashArray) {
				stroke.dashStyle = isArray(options.dashArray) ?
				    options.dashArray.join(' ') :
				    options.dashArray.replace(/( *, *)/g, ' ');
			} else {
				stroke.dashStyle = '';
			}
			stroke.endcap = options.lineCap.replace('butt', 'flat');
			stroke.joinstyle = options.lineJoin;

		} else if (stroke) {
			container.removeChild(stroke);
			layer._stroke = null;
		}

		if (options.fill) {
			if (!fill) {
				fill = layer._fill = vmlCreate('fill');
			}
			container.appendChild(fill);
			fill.color = options.fillColor || options.color;
			fill.opacity = options.fillOpacity;

		} else if (fill) {
			container.removeChild(fill);
			layer._fill = null;
		}
	},

	_updateCircle: function (layer) {
		var p = layer._point.round(),
		    r = Math.round(layer._radius),
		    r2 = Math.round(layer._radiusY || r);

		this._setPath(layer, layer._empty() ? 'M0 0' :
			'AL ' + p.x + ',' + p.y + ' ' + r + ',' + r2 + ' 0,' + (65535 * 360));
	},

	_setPath: function (layer, path) {
		layer._path.v = path;
	},

	_bringToFront: function (layer) {
		toFront(layer._container);
	},

	_bringToBack: function (layer) {
		toBack(layer._container);
	}
};

var create$2 = vml ? vmlCreate : svgCreate;

/*
 * @class SVG
 * @inherits Renderer
 * @aka L.SVG
 *
 * Allows vector layers to be displayed with [SVG](https://developer.mozilla.org/docs/Web/SVG).
 * Inherits `Renderer`.
 *
 * Due to [technical limitations](http://caniuse.com/#search=svg), SVG is not
 * available in all web browsers, notably Android 2.x and 3.x.
 *
 * Although SVG is not available on IE7 and IE8, these browsers support
 * [VML](https://en.wikipedia.org/wiki/Vector_Markup_Language)
 * (a now deprecated technology), and the SVG renderer will fall back to VML in
 * this case.
 *
 * @example
 *
 * Use SVG by default for all paths in the map:
 *
 * ```js
 * var map = L.map('map', {
 * 	renderer: L.svg()
 * });
 * ```
 *
 * Use a SVG renderer with extra padding for specific vector geometries:
 *
 * ```js
 * var map = L.map('map');
 * var myRenderer = L.svg({ padding: 0.5 });
 * var line = L.polyline( coordinates, { renderer: myRenderer } );
 * var circle = L.circle( center, { renderer: myRenderer } );
 * ```
 */

var SVG = Renderer.extend({

	getEvents: function () {
		var events = Renderer.prototype.getEvents.call(this);
		events.zoomstart = this._onZoomStart;
		return events;
	},

	_initContainer: function () {
		this._container = create$2('svg');

		// makes it possible to click through svg root; we'll reset it back in individual paths
		this._container.setAttribute('pointer-events', 'none');

		this._rootGroup = create$2('g');
		this._container.appendChild(this._rootGroup);
	},

	_destroyContainer: function () {
		remove(this._container);
		off(this._container);
		delete this._container;
		delete this._rootGroup;
		delete this._svgSize;
	},

	_onZoomStart: function () {
		// Drag-then-pinch interactions might mess up the center and zoom.
		// In this case, the easiest way to prevent this is re-do the renderer
		//   bounds and padding when the zooming starts.
		this._update();
	},

	_update: function () {
		if (this._map._animatingZoom && this._bounds) { return; }

		Renderer.prototype._update.call(this);

		var b = this._bounds,
		    size = b.getSize(),
		    container = this._container;

		// set size of svg-container if changed
		if (!this._svgSize || !this._svgSize.equals(size)) {
			this._svgSize = size;
			container.setAttribute('width', size.x);
			container.setAttribute('height', size.y);
		}

		// movement: update container viewBox so that we don't have to change coordinates of individual layers
		setPosition(container, b.min);
		container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

		this.fire('update');
	},

	// methods below are called by vector layers implementations

	_initPath: function (layer) {
		var path = layer._path = create$2('path');

		// @namespace Path
		// @option className: String = null
		// Custom class name set on an element. Only for SVG renderer.
		if (layer.options.className) {
			addClass(path, layer.options.className);
		}

		if (layer.options.interactive) {
			addClass(path, 'leaflet-interactive');
		}

		this._updateStyle(layer);
		this._layers[stamp(layer)] = layer;
	},

	_addPath: function (layer) {
		if (!this._rootGroup) { this._initContainer(); }
		this._rootGroup.appendChild(layer._path);
		layer.addInteractiveTarget(layer._path);
	},

	_removePath: function (layer) {
		remove(layer._path);
		layer.removeInteractiveTarget(layer._path);
		delete this._layers[stamp(layer)];
	},

	_updatePath: function (layer) {
		layer._project();
		layer._update();
	},

	_updateStyle: function (layer) {
		var path = layer._path,
		    options = layer.options;

		if (!path) { return; }

		if (options.stroke) {
			path.setAttribute('stroke', options.color);
			path.setAttribute('stroke-opacity', options.opacity);
			path.setAttribute('stroke-width', options.weight);
			path.setAttribute('stroke-linecap', options.lineCap);
			path.setAttribute('stroke-linejoin', options.lineJoin);

			if (options.dashArray) {
				path.setAttribute('stroke-dasharray', options.dashArray);
			} else {
				path.removeAttribute('stroke-dasharray');
			}

			if (options.dashOffset) {
				path.setAttribute('stroke-dashoffset', options.dashOffset);
			} else {
				path.removeAttribute('stroke-dashoffset');
			}
		} else {
			path.setAttribute('stroke', 'none');
		}

		if (options.fill) {
			path.setAttribute('fill', options.fillColor || options.color);
			path.setAttribute('fill-opacity', options.fillOpacity);
			path.setAttribute('fill-rule', options.fillRule || 'evenodd');
		} else {
			path.setAttribute('fill', 'none');
		}
	},

	_updatePoly: function (layer, closed) {
		this._setPath(layer, pointsToPath(layer._parts, closed));
	},

	_updateCircle: function (layer) {
		var p = layer._point,
		    r = Math.max(Math.round(layer._radius), 1),
		    r2 = Math.max(Math.round(layer._radiusY), 1) || r,
		    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

		// drawing a circle with two half-arcs
		var d = layer._empty() ? 'M0 0' :
			'M' + (p.x - r) + ',' + p.y +
			arc + (r * 2) + ',0 ' +
			arc + (-r * 2) + ',0 ';

		this._setPath(layer, d);
	},

	_setPath: function (layer, path) {
		layer._path.setAttribute('d', path);
	},

	// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
	_bringToFront: function (layer) {
		toFront(layer._path);
	},

	_bringToBack: function (layer) {
		toBack(layer._path);
	}
});

if (vml) {
	SVG.include(vmlMixin);
}

// @namespace SVG
// @factory L.svg(options?: Renderer options)
// Creates a SVG renderer with the given options.
function svg$1(options) {
	return svg || vml ? new SVG(options) : null;
}

Map.include({
	// @namespace Map; @method getRenderer(layer: Path): Renderer
	// Returns the instance of `Renderer` that should be used to render the given
	// `Path`. It will ensure that the `renderer` options of the map and paths
	// are respected, and that the renderers do exist on the map.
	getRenderer: function (layer) {
		// @namespace Path; @option renderer: Renderer
		// Use this specific instance of `Renderer` for this path. Takes
		// precedence over the map's [default renderer](#map-renderer).
		var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

		if (!renderer) {
			// @namespace Map; @option preferCanvas: Boolean = false
			// Whether `Path`s should be rendered on a `Canvas` renderer.
			// By default, all `Path`s are rendered in a `SVG` renderer.
			renderer = this._renderer = (this.options.preferCanvas && canvas$1()) || svg$1();
		}

		if (!this.hasLayer(renderer)) {
			this.addLayer(renderer);
		}
		return renderer;
	},

	_getPaneRenderer: function (name) {
		if (name === 'overlayPane' || name === undefined) {
			return false;
		}

		var renderer = this._paneRenderers[name];
		if (renderer === undefined) {
			renderer = (SVG && svg$1({pane: name})) || (Canvas && canvas$1({pane: name}));
			this._paneRenderers[name] = renderer;
		}
		return renderer;
	}
});

/*
 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
 */

/*
 * @class Rectangle
 * @aka L.Rectangle
 * @inherits Polygon
 *
 * A class for drawing rectangle overlays on a map. Extends `Polygon`.
 *
 * @example
 *
 * ```js
 * // define rectangle geographical bounds
 * var bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
 *
 * // create an orange rectangle
 * L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
 *
 * // zoom the map to the rectangle bounds
 * map.fitBounds(bounds);
 * ```
 *
 */


var Rectangle = Polygon.extend({
	initialize: function (latLngBounds, options) {
		Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
	},

	// @method setBounds(latLngBounds: LatLngBounds): this
	// Redraws the rectangle with the passed bounds.
	setBounds: function (latLngBounds) {
		return this.setLatLngs(this._boundsToLatLngs(latLngBounds));
	},

	_boundsToLatLngs: function (latLngBounds) {
		latLngBounds = toLatLngBounds(latLngBounds);
		return [
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast()
		];
	}
});


// @factory L.rectangle(latLngBounds: LatLngBounds, options?: Polyline options)
function rectangle(latLngBounds, options) {
	return new Rectangle(latLngBounds, options);
}

SVG.create = create$2;
SVG.pointsToPath = pointsToPath;

GeoJSON.geometryToLayer = geometryToLayer;
GeoJSON.coordsToLatLng = coordsToLatLng;
GeoJSON.coordsToLatLngs = coordsToLatLngs;
GeoJSON.latLngToCoords = latLngToCoords;
GeoJSON.latLngsToCoords = latLngsToCoords;
GeoJSON.getFeature = getFeature;
GeoJSON.asFeature = asFeature;

/*
 * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
 * (zoom to a selected bounding box), enabled by default.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @option boxZoom: Boolean = true
	// Whether the map can be zoomed to a rectangular area specified by
	// dragging the mouse while pressing the shift key.
	boxZoom: true
});

var BoxZoom = Handler.extend({
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
		this._resetStateTimeout = 0;
		map.on('unload', this._destroy, this);
	},

	addHooks: function () {
		on(this._container, 'mousedown', this._onMouseDown, this);
	},

	removeHooks: function () {
		off(this._container, 'mousedown', this._onMouseDown, this);
	},

	moved: function () {
		return this._moved;
	},

	_destroy: function () {
		remove(this._pane);
		delete this._pane;
	},

	_resetState: function () {
		this._resetStateTimeout = 0;
		this._moved = false;
	},

	_clearDeferredResetState: function () {
		if (this._resetStateTimeout !== 0) {
			clearTimeout(this._resetStateTimeout);
			this._resetStateTimeout = 0;
		}
	},

	_onMouseDown: function (e) {
		if (!e.shiftKey || ((e.which !== 1) && (e.button !== 1))) { return false; }

		// Clear the deferred resetState if it hasn't executed yet, otherwise it
		// will interrupt the interaction and orphan a box element in the container.
		this._clearDeferredResetState();
		this._resetState();

		disableTextSelection();
		disableImageDrag();

		this._startPoint = this._map.mouseEventToContainerPoint(e);

		on(document, {
			contextmenu: stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseMove: function (e) {
		if (!this._moved) {
			this._moved = true;

			this._box = create$1('div', 'leaflet-zoom-box', this._container);
			addClass(this._container, 'leaflet-crosshair');

			this._map.fire('boxzoomstart');
		}

		this._point = this._map.mouseEventToContainerPoint(e);

		var bounds = new Bounds(this._point, this._startPoint),
		    size = bounds.getSize();

		setPosition(this._box, bounds.min);

		this._box.style.width  = size.x + 'px';
		this._box.style.height = size.y + 'px';
	},

	_finish: function () {
		if (this._moved) {
			remove(this._box);
			removeClass(this._container, 'leaflet-crosshair');
		}

		enableTextSelection();
		enableImageDrag();

		off(document, {
			contextmenu: stop,
			mousemove: this._onMouseMove,
			mouseup: this._onMouseUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onMouseUp: function (e) {
		if ((e.which !== 1) && (e.button !== 1)) { return; }

		this._finish();

		if (!this._moved) { return; }
		// Postpone to next JS tick so internal click event handling
		// still see it as "moved".
		this._clearDeferredResetState();
		this._resetStateTimeout = setTimeout(bind(this._resetState, this), 0);

		var bounds = new LatLngBounds(
		        this._map.containerPointToLatLng(this._startPoint),
		        this._map.containerPointToLatLng(this._point));

		this._map
			.fitBounds(bounds)
			.fire('boxzoomend', {boxZoomBounds: bounds});
	},

	_onKeyDown: function (e) {
		if (e.keyCode === 27) {
			this._finish();
		}
	}
});

// @section Handlers
// @property boxZoom: Handler
// Box (shift-drag with mouse) zoom handler.
Map.addInitHook('addHandler', 'boxZoom', BoxZoom);

/*
 * L.Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

// @namespace Map
// @section Interaction Options

Map.mergeOptions({
	// @option doubleClickZoom: Boolean|String = true
	// Whether the map can be zoomed in by double clicking on it and
	// zoomed out by double clicking while holding shift. If passed
	// `'center'`, double-click zoom will zoom to the center of the
	//  view regardless of where the mouse was.
	doubleClickZoom: true
});

var DoubleClickZoom = Handler.extend({
	addHooks: function () {
		this._map.on('dblclick', this._onDoubleClick, this);
	},

	removeHooks: function () {
		this._map.off('dblclick', this._onDoubleClick, this);
	},

	_onDoubleClick: function (e) {
		var map = this._map,
		    oldZoom = map.getZoom(),
		    delta = map.options.zoomDelta,
		    zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

		if (map.options.doubleClickZoom === 'center') {
			map.setZoom(zoom);
		} else {
			map.setZoomAround(e.containerPoint, zoom);
		}
	}
});

// @section Handlers
//
// Map properties include interaction handlers that allow you to control
// interaction behavior in runtime, enabling or disabling certain features such
// as dragging or touch zoom (see `Handler` methods). For example:
//
// ```js
// map.doubleClickZoom.disable();
// ```
//
// @property doubleClickZoom: Handler
// Double click zoom handler.
Map.addInitHook('addHandler', 'doubleClickZoom', DoubleClickZoom);

/*
 * L.Handler.MapDrag is used to make the map draggable (with panning inertia), enabled by default.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @option dragging: Boolean = true
	// Whether the map be draggable with mouse/touch or not.
	dragging: true,

	// @section Panning Inertia Options
	// @option inertia: Boolean = *
	// If enabled, panning of the map will have an inertia effect where
	// the map builds momentum while dragging and continues moving in
	// the same direction for some time. Feels especially nice on touch
	// devices. Enabled by default unless running on old Android devices.
	inertia: !android23,

	// @option inertiaDeceleration: Number = 3000
	// The rate with which the inertial movement slows down, in pixels/second².
	inertiaDeceleration: 3400, // px/s^2

	// @option inertiaMaxSpeed: Number = Infinity
	// Max speed of the inertial movement, in pixels/second.
	inertiaMaxSpeed: Infinity, // px/s

	// @option easeLinearity: Number = 0.2
	easeLinearity: 0.2,

	// TODO refactor, move to CRS
	// @option worldCopyJump: Boolean = false
	// With this option enabled, the map tracks when you pan to another "copy"
	// of the world and seamlessly jumps to the original one so that all overlays
	// like markers and vector layers are still visible.
	worldCopyJump: false,

	// @option maxBoundsViscosity: Number = 0.0
	// If `maxBounds` is set, this option will control how solid the bounds
	// are when dragging the map around. The default value of `0.0` allows the
	// user to drag outside the bounds at normal speed, higher values will
	// slow down map dragging outside bounds, and `1.0` makes the bounds fully
	// solid, preventing the user from dragging outside the bounds.
	maxBoundsViscosity: 0.0
});

var Drag = Handler.extend({
	addHooks: function () {
		if (!this._draggable) {
			var map = this._map;

			this._draggable = new Draggable(map._mapPane, map._container);

			this._draggable.on({
				dragstart: this._onDragStart,
				drag: this._onDrag,
				dragend: this._onDragEnd
			}, this);

			this._draggable.on('predrag', this._onPreDragLimit, this);
			if (map.options.worldCopyJump) {
				this._draggable.on('predrag', this._onPreDragWrap, this);
				map.on('zoomend', this._onZoomEnd, this);

				map.whenReady(this._onZoomEnd, this);
			}
		}
		addClass(this._map._container, 'leaflet-grab leaflet-touch-drag');
		this._draggable.enable();
		this._positions = [];
		this._times = [];
	},

	removeHooks: function () {
		removeClass(this._map._container, 'leaflet-grab');
		removeClass(this._map._container, 'leaflet-touch-drag');
		this._draggable.disable();
	},

	moved: function () {
		return this._draggable && this._draggable._moved;
	},

	moving: function () {
		return this._draggable && this._draggable._moving;
	},

	_onDragStart: function () {
		var map = this._map;

		map._stop();
		if (this._map.options.maxBounds && this._map.options.maxBoundsViscosity) {
			var bounds = toLatLngBounds(this._map.options.maxBounds);

			this._offsetLimit = toBounds(
				this._map.latLngToContainerPoint(bounds.getNorthWest()).multiplyBy(-1),
				this._map.latLngToContainerPoint(bounds.getSouthEast()).multiplyBy(-1)
					.add(this._map.getSize()));

			this._viscosity = Math.min(1.0, Math.max(0.0, this._map.options.maxBoundsViscosity));
		} else {
			this._offsetLimit = null;
		}

		map
		    .fire('movestart')
		    .fire('dragstart');

		if (map.options.inertia) {
			this._positions = [];
			this._times = [];
		}
	},

	_onDrag: function (e) {
		if (this._map.options.inertia) {
			var time = this._lastTime = +new Date(),
			    pos = this._lastPos = this._draggable._absPos || this._draggable._newPos;

			this._positions.push(pos);
			this._times.push(time);

			this._prunePositions(time);
		}

		this._map
		    .fire('move', e)
		    .fire('drag', e);
	},

	_prunePositions: function (time) {
		while (this._positions.length > 1 && time - this._times[0] > 50) {
			this._positions.shift();
			this._times.shift();
		}
	},

	_onZoomEnd: function () {
		var pxCenter = this._map.getSize().divideBy(2),
		    pxWorldCenter = this._map.latLngToLayerPoint([0, 0]);

		this._initialWorldOffset = pxWorldCenter.subtract(pxCenter).x;
		this._worldWidth = this._map.getPixelWorldBounds().getSize().x;
	},

	_viscousLimit: function (value, threshold) {
		return value - (value - threshold) * this._viscosity;
	},

	_onPreDragLimit: function () {
		if (!this._viscosity || !this._offsetLimit) { return; }

		var offset = this._draggable._newPos.subtract(this._draggable._startPos);

		var limit = this._offsetLimit;
		if (offset.x < limit.min.x) { offset.x = this._viscousLimit(offset.x, limit.min.x); }
		if (offset.y < limit.min.y) { offset.y = this._viscousLimit(offset.y, limit.min.y); }
		if (offset.x > limit.max.x) { offset.x = this._viscousLimit(offset.x, limit.max.x); }
		if (offset.y > limit.max.y) { offset.y = this._viscousLimit(offset.y, limit.max.y); }

		this._draggable._newPos = this._draggable._startPos.add(offset);
	},

	_onPreDragWrap: function () {
		// TODO refactor to be able to adjust map pane position after zoom
		var worldWidth = this._worldWidth,
		    halfWidth = Math.round(worldWidth / 2),
		    dx = this._initialWorldOffset,
		    x = this._draggable._newPos.x,
		    newX1 = (x - halfWidth + dx) % worldWidth + halfWidth - dx,
		    newX2 = (x + halfWidth + dx) % worldWidth - halfWidth - dx,
		    newX = Math.abs(newX1 + dx) < Math.abs(newX2 + dx) ? newX1 : newX2;

		this._draggable._absPos = this._draggable._newPos.clone();
		this._draggable._newPos.x = newX;
	},

	_onDragEnd: function (e) {
		var map = this._map,
		    options = map.options,

		    noInertia = !options.inertia || this._times.length < 2;

		map.fire('dragend', e);

		if (noInertia) {
			map.fire('moveend');

		} else {
			this._prunePositions(+new Date());

			var direction = this._lastPos.subtract(this._positions[0]),
			    duration = (this._lastTime - this._times[0]) / 1000,
			    ease = options.easeLinearity,

			    speedVector = direction.multiplyBy(ease / duration),
			    speed = speedVector.distanceTo([0, 0]),

			    limitedSpeed = Math.min(options.inertiaMaxSpeed, speed),
			    limitedSpeedVector = speedVector.multiplyBy(limitedSpeed / speed),

			    decelerationDuration = limitedSpeed / (options.inertiaDeceleration * ease),
			    offset = limitedSpeedVector.multiplyBy(-decelerationDuration / 2).round();

			if (!offset.x && !offset.y) {
				map.fire('moveend');

			} else {
				offset = map._limitOffset(offset, map.options.maxBounds);

				requestAnimFrame(function () {
					map.panBy(offset, {
						duration: decelerationDuration,
						easeLinearity: ease,
						noMoveStart: true,
						animate: true
					});
				});
			}
		}
	}
});

// @section Handlers
// @property dragging: Handler
// Map dragging handler (by both mouse and touch).
Map.addInitHook('addHandler', 'dragging', Drag);

/*
 * L.Map.Keyboard is handling keyboard interaction with the map, enabled by default.
 */

// @namespace Map
// @section Keyboard Navigation Options
Map.mergeOptions({
	// @option keyboard: Boolean = true
	// Makes the map focusable and allows users to navigate the map with keyboard
	// arrows and `+`/`-` keys.
	keyboard: true,

	// @option keyboardPanDelta: Number = 80
	// Amount of pixels to pan when pressing an arrow key.
	keyboardPanDelta: 80
});

var Keyboard = Handler.extend({

	keyCodes: {
		left:    [37],
		right:   [39],
		down:    [40],
		up:      [38],
		zoomIn:  [187, 107, 61, 171],
		zoomOut: [189, 109, 54, 173]
	},

	initialize: function (map) {
		this._map = map;

		this._setPanDelta(map.options.keyboardPanDelta);
		this._setZoomDelta(map.options.zoomDelta);
	},

	addHooks: function () {
		var container = this._map._container;

		// make the container focusable by tabbing
		if (container.tabIndex <= 0) {
			container.tabIndex = '0';
		}

		on(container, {
			focus: this._onFocus,
			blur: this._onBlur,
			mousedown: this._onMouseDown
		}, this);

		this._map.on({
			focus: this._addHooks,
			blur: this._removeHooks
		}, this);
	},

	removeHooks: function () {
		this._removeHooks();

		off(this._map._container, {
			focus: this._onFocus,
			blur: this._onBlur,
			mousedown: this._onMouseDown
		}, this);

		this._map.off({
			focus: this._addHooks,
			blur: this._removeHooks
		}, this);
	},

	_onMouseDown: function () {
		if (this._focused) { return; }

		var body = document.body,
		    docEl = document.documentElement,
		    top = body.scrollTop || docEl.scrollTop,
		    left = body.scrollLeft || docEl.scrollLeft;

		this._map._container.focus();

		window.scrollTo(left, top);
	},

	_onFocus: function () {
		this._focused = true;
		this._map.fire('focus');
	},

	_onBlur: function () {
		this._focused = false;
		this._map.fire('blur');
	},

	_setPanDelta: function (panDelta) {
		var keys = this._panKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.left.length; i < len; i++) {
			keys[codes.left[i]] = [-1 * panDelta, 0];
		}
		for (i = 0, len = codes.right.length; i < len; i++) {
			keys[codes.right[i]] = [panDelta, 0];
		}
		for (i = 0, len = codes.down.length; i < len; i++) {
			keys[codes.down[i]] = [0, panDelta];
		}
		for (i = 0, len = codes.up.length; i < len; i++) {
			keys[codes.up[i]] = [0, -1 * panDelta];
		}
	},

	_setZoomDelta: function (zoomDelta) {
		var keys = this._zoomKeys = {},
		    codes = this.keyCodes,
		    i, len;

		for (i = 0, len = codes.zoomIn.length; i < len; i++) {
			keys[codes.zoomIn[i]] = zoomDelta;
		}
		for (i = 0, len = codes.zoomOut.length; i < len; i++) {
			keys[codes.zoomOut[i]] = -zoomDelta;
		}
	},

	_addHooks: function () {
		on(document, 'keydown', this._onKeyDown, this);
	},

	_removeHooks: function () {
		off(document, 'keydown', this._onKeyDown, this);
	},

	_onKeyDown: function (e) {
		if (e.altKey || e.ctrlKey || e.metaKey) { return; }

		var key = e.keyCode,
		    map = this._map,
		    offset;

		if (key in this._panKeys) {

			if (map._panAnim && map._panAnim._inProgress) { return; }

			offset = this._panKeys[key];
			if (e.shiftKey) {
				offset = toPoint(offset).multiplyBy(3);
			}

			map.panBy(offset);

			if (map.options.maxBounds) {
				map.panInsideBounds(map.options.maxBounds);
			}

		} else if (key in this._zoomKeys) {
			map.setZoom(map.getZoom() + (e.shiftKey ? 3 : 1) * this._zoomKeys[key]);

		} else if (key === 27 && map._popup && map._popup.options.closeOnEscapeKey) {
			map.closePopup();

		} else {
			return;
		}

		stop(e);
	}
});

// @section Handlers
// @section Handlers
// @property keyboard: Handler
// Keyboard navigation handler.
Map.addInitHook('addHandler', 'keyboard', Keyboard);

/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Mousewheel options
	// @option scrollWheelZoom: Boolean|String = true
	// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
	// it will zoom to the center of the view regardless of where the mouse was.
	scrollWheelZoom: true,

	// @option wheelDebounceTime: Number = 40
	// Limits the rate at which a wheel can fire (in milliseconds). By default
	// user can't zoom via wheel more often than once per 40 ms.
	wheelDebounceTime: 40,

	// @option wheelPxPerZoomLevel: Number = 60
	// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
	// mean a change of one full zoom level. Smaller values will make wheel-zooming
	// faster (and vice versa).
	wheelPxPerZoomLevel: 60
});

var ScrollWheelZoom = Handler.extend({
	addHooks: function () {
		on(this._map._container, 'mousewheel', this._onWheelScroll, this);

		this._delta = 0;
	},

	removeHooks: function () {
		off(this._map._container, 'mousewheel', this._onWheelScroll, this);
	},

	_onWheelScroll: function (e) {
		var delta = getWheelDelta(e);

		var debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);

		if (!this._startTime) {
			this._startTime = +new Date();
		}

		var left = Math.max(debounce - (+new Date() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(bind(this._performZoom, this), left);

		stop(e);
	},

	_performZoom: function () {
		var map = this._map,
		    zoom = map.getZoom(),
		    snap = this._map.options.zoomSnap || 0;

		map._stop(); // stop panning and fly animations if any

		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
		var d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
		    d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
		    d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
		    delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta) { return; }

		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta);
		} else {
			map.setZoomAround(this._lastMousePos, zoom + delta);
		}
	}
});

// @section Handlers
// @property scrollWheelZoom: Handler
// Scroll wheel zoom handler.
Map.addInitHook('addHandler', 'scrollWheelZoom', ScrollWheelZoom);

/*
 * L.Map.Tap is used to enable mobile hacks like quick taps and long hold.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option tap: Boolean = true
	// Enables mobile hacks for supporting instant taps (fixing 200ms click
	// delay on iOS/Android) and touch holds (fired as `contextmenu` events).
	tap: true,

	// @option tapTolerance: Number = 15
	// The max number of pixels a user can shift his finger during touch
	// for it to be considered a valid tap.
	tapTolerance: 15
});

var Tap = Handler.extend({
	addHooks: function () {
		on(this._map._container, 'touchstart', this._onDown, this);
	},

	removeHooks: function () {
		off(this._map._container, 'touchstart', this._onDown, this);
	},

	_onDown: function (e) {
		if (!e.touches) { return; }

		preventDefault(e);

		this._fireClick = true;

		// don't simulate click or track longpress if more than 1 touch
		if (e.touches.length > 1) {
			this._fireClick = false;
			clearTimeout(this._holdTimeout);
			return;
		}

		var first = e.touches[0],
		    el = first.target;

		this._startPos = this._newPos = new Point(first.clientX, first.clientY);

		// if touching a link, highlight it
		if (el.tagName && el.tagName.toLowerCase() === 'a') {
			addClass(el, 'leaflet-active');
		}

		// simulate long hold but setting a timeout
		this._holdTimeout = setTimeout(bind(function () {
			if (this._isTapValid()) {
				this._fireClick = false;
				this._onUp();
				this._simulateEvent('contextmenu', first);
			}
		}, this), 1000);

		this._simulateEvent('mousedown', first);

		on(document, {
			touchmove: this._onMove,
			touchend: this._onUp
		}, this);
	},

	_onUp: function (e) {
		clearTimeout(this._holdTimeout);

		off(document, {
			touchmove: this._onMove,
			touchend: this._onUp
		}, this);

		if (this._fireClick && e && e.changedTouches) {

			var first = e.changedTouches[0],
			    el = first.target;

			if (el && el.tagName && el.tagName.toLowerCase() === 'a') {
				removeClass(el, 'leaflet-active');
			}

			this._simulateEvent('mouseup', first);

			// simulate click if the touch didn't move too much
			if (this._isTapValid()) {
				this._simulateEvent('click', first);
			}
		}
	},

	_isTapValid: function () {
		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
	},

	_onMove: function (e) {
		var first = e.touches[0];
		this._newPos = new Point(first.clientX, first.clientY);
		this._simulateEvent('mousemove', first);
	},

	_simulateEvent: function (type, e) {
		var simulatedEvent = document.createEvent('MouseEvents');

		simulatedEvent._simulated = true;
		e.target._simulatedClick = true;

		simulatedEvent.initMouseEvent(
		        type, true, true, window, 1,
		        e.screenX, e.screenY,
		        e.clientX, e.clientY,
		        false, false, false, false, 0, null);

		e.target.dispatchEvent(simulatedEvent);
	}
});

// @section Handlers
// @property tap: Handler
// Mobile touch hacks (quick tap and touch hold) handler.
if (touch && !pointer) {
	Map.addInitHook('addHandler', 'tap', Tap);
}

/*
 * L.Handler.TouchZoom is used by L.Map to add pinch zoom on supported mobile browsers.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option touchZoom: Boolean|String = *
	// Whether the map can be zoomed by touch-dragging with two fingers. If
	// passed `'center'`, it will zoom to the center of the view regardless of
	// where the touch events (fingers) were. Enabled for touch-capable web
	// browsers except for old Androids.
	touchZoom: touch && !android23,

	// @option bounceAtZoomLimits: Boolean = true
	// Set it to false if you don't want the map to zoom beyond min/max zoom
	// and then bounce back when pinch-zooming.
	bounceAtZoomLimits: true
});

var TouchZoom = Handler.extend({
	addHooks: function () {
		addClass(this._map._container, 'leaflet-touch-zoom');
		on(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	removeHooks: function () {
		removeClass(this._map._container, 'leaflet-touch-zoom');
		off(this._map._container, 'touchstart', this._onTouchStart, this);
	},

	_onTouchStart: function (e) {
		var map = this._map;
		if (!e.touches || e.touches.length !== 2 || map._animatingZoom || this._zooming) { return; }

		var p1 = map.mouseEventToContainerPoint(e.touches[0]),
		    p2 = map.mouseEventToContainerPoint(e.touches[1]);

		this._centerPoint = map.getSize()._divideBy(2);
		this._startLatLng = map.containerPointToLatLng(this._centerPoint);
		if (map.options.touchZoom !== 'center') {
			this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
		}

		this._startDist = p1.distanceTo(p2);
		this._startZoom = map.getZoom();

		this._moved = false;
		this._zooming = true;

		map._stop();

		on(document, 'touchmove', this._onTouchMove, this);
		on(document, 'touchend', this._onTouchEnd, this);

		preventDefault(e);
	},

	_onTouchMove: function (e) {
		if (!e.touches || e.touches.length !== 2 || !this._zooming) { return; }

		var map = this._map,
		    p1 = map.mouseEventToContainerPoint(e.touches[0]),
		    p2 = map.mouseEventToContainerPoint(e.touches[1]),
		    scale = p1.distanceTo(p2) / this._startDist;

		this._zoom = map.getScaleZoom(scale, this._startZoom);

		if (!map.options.bounceAtZoomLimits && (
			(this._zoom < map.getMinZoom() && scale < 1) ||
			(this._zoom > map.getMaxZoom() && scale > 1))) {
			this._zoom = map._limitZoom(this._zoom);
		}

		if (map.options.touchZoom === 'center') {
			this._center = this._startLatLng;
			if (scale === 1) { return; }
		} else {
			// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
			var delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
			if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
			this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
		}

		if (!this._moved) {
			map._moveStart(true, false);
			this._moved = true;
		}

		cancelAnimFrame(this._animRequest);

		var moveFn = bind(map._move, map, this._center, this._zoom, {pinch: true, round: false});
		this._animRequest = requestAnimFrame(moveFn, this, true);

		preventDefault(e);
	},

	_onTouchEnd: function () {
		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		this._zooming = false;
		cancelAnimFrame(this._animRequest);

		off(document, 'touchmove', this._onTouchMove);
		off(document, 'touchend', this._onTouchEnd);

		// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
		if (this._map.options.zoomAnimation) {
			this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
		} else {
			this._map._resetView(this._center, this._map._limitZoom(this._zoom));
		}
	}
});

// @section Handlers
// @property touchZoom: Handler
// Touch zoom handler.
Map.addInitHook('addHandler', 'touchZoom', TouchZoom);

Map.BoxZoom = BoxZoom;
Map.DoubleClickZoom = DoubleClickZoom;
Map.Drag = Drag;
Map.Keyboard = Keyboard;
Map.ScrollWheelZoom = ScrollWheelZoom;
Map.Tap = Tap;
Map.TouchZoom = TouchZoom;

// misc

var oldL = window.L;
function noConflict() {
	window.L = oldL;
	return this;
}

// Always export us to window global (see #2364)
window.L = exports;

Object.freeze = freeze;

exports.version = version;
exports.noConflict = noConflict;
exports.Control = Control;
exports.control = control;
exports.Browser = Browser;
exports.Evented = Evented;
exports.Mixin = Mixin;
exports.Util = Util;
exports.Class = Class;
exports.Handler = Handler;
exports.extend = extend;
exports.bind = bind;
exports.stamp = stamp;
exports.setOptions = setOptions;
exports.DomEvent = DomEvent;
exports.DomUtil = DomUtil;
exports.PosAnimation = PosAnimation;
exports.Draggable = Draggable;
exports.LineUtil = LineUtil;
exports.PolyUtil = PolyUtil;
exports.Point = Point;
exports.point = toPoint;
exports.Bounds = Bounds;
exports.bounds = toBounds;
exports.Transformation = Transformation;
exports.transformation = toTransformation;
exports.Projection = index;
exports.LatLng = LatLng;
exports.latLng = toLatLng;
exports.LatLngBounds = LatLngBounds;
exports.latLngBounds = toLatLngBounds;
exports.CRS = CRS;
exports.GeoJSON = GeoJSON;
exports.geoJSON = geoJSON;
exports.geoJson = geoJson;
exports.Layer = Layer;
exports.LayerGroup = LayerGroup;
exports.layerGroup = layerGroup;
exports.FeatureGroup = FeatureGroup;
exports.featureGroup = featureGroup;
exports.ImageOverlay = ImageOverlay;
exports.imageOverlay = imageOverlay;
exports.VideoOverlay = VideoOverlay;
exports.videoOverlay = videoOverlay;
exports.DivOverlay = DivOverlay;
exports.Popup = Popup;
exports.popup = popup;
exports.Tooltip = Tooltip;
exports.tooltip = tooltip;
exports.Icon = Icon;
exports.icon = icon;
exports.DivIcon = DivIcon;
exports.divIcon = divIcon;
exports.Marker = Marker;
exports.marker = marker;
exports.TileLayer = TileLayer;
exports.tileLayer = tileLayer;
exports.GridLayer = GridLayer;
exports.gridLayer = gridLayer;
exports.SVG = SVG;
exports.svg = svg$1;
exports.Renderer = Renderer;
exports.Canvas = Canvas;
exports.canvas = canvas$1;
exports.Path = Path;
exports.CircleMarker = CircleMarker;
exports.circleMarker = circleMarker;
exports.Circle = Circle;
exports.circle = circle;
exports.Polyline = Polyline;
exports.polyline = polyline;
exports.Polygon = Polygon;
exports.polygon = polygon;
exports.Rectangle = Rectangle;
exports.rectangle = rectangle;
exports.Map = Map;
exports.map = createMap;

})));
//# sourceMappingURL=leaflet-src.js.map

/* esri-leaflet - v2.1.4 - Fri Mar 09 2018 18:29:17 GMT-0800 (PST)
 * Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("leaflet")):"function"==typeof define&&define.amd?define(["exports","leaflet"],e):e((t.L=t.L||{},t.L.esri={}),t.L)}(this,function(t,e){"use strict";var i=window.XMLHttpRequest&&"withCredentials"in new window.XMLHttpRequest,s=""===document.documentElement.style.pointerEvents,r={cors:i,pointerEvents:s},n={attributionWidthOffset:55},o=0;function a(t){var e="";for(var i in t.f=t.f||"json",t)if(t.hasOwnProperty(i)){var s,r=t[i],n=Object.prototype.toString.call(r);e.length&&(e+="&"),s="[object Array]"===n?"[object Object]"===Object.prototype.toString.call(r[0])?JSON.stringify(r):r.join(","):"[object Object]"===n?JSON.stringify(r):"[object Date]"===n?r.valueOf():r,e+=encodeURIComponent(i)+"="+encodeURIComponent(s)}return e}function l(t,i){var s=new window.XMLHttpRequest;return s.onerror=function(r){s.onreadystatechange=e.Util.falseFn,t.call(i,{error:{code:500,message:"XMLHttpRequest error"}},null)},s.onreadystatechange=function(){var r,n;if(4===s.readyState){try{r=JSON.parse(s.responseText)}catch(t){r=null,n={code:500,message:"Could not parse response as JSON. This could also be caused by a CORS or XMLHttpRequest error."}}!n&&r.error&&(n=r.error,r=null),s.onerror=e.Util.falseFn,t.call(i,n,r)}},s.ontimeout=function(){this.onerror()},s}function u(t,e,i,s){var r=l(i,s);return r.open("POST",t),void 0!==s&&null!==s&&void 0!==s.options&&(r.timeout=s.options.timeout),r.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),r.send(a(e)),r}function h(t,e,i,s){var r=l(i,s);return r.open("GET",t+"?"+a(e),!0),void 0!==s&&null!==s&&void 0!==s.options&&(r.timeout=s.options.timeout),r.send(null),r}function c(t,e,i,s){var n=a(e),o=l(i,s),u=(t+"?"+n).length;if(u<=2e3&&r.cors?o.open("GET",t+"?"+n):u>2e3&&r.cors&&(o.open("POST",t),o.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8")),void 0!==s&&null!==s&&void 0!==s.options&&(o.timeout=s.options.timeout),u<=2e3&&r.cors)o.send(null);else{if(!(u>2e3&&r.cors))return u<=2e3&&!r.cors?p(t,e,i,s):void M("a request to "+t+" was longer then 2000 characters and this browser cannot make a cross-domain post request. Please use a proxy http://esri.github.io/esri-leaflet/api-reference/request.html");o.send(n)}return o}function p(t,i,s,r){window._EsriLeafletCallbacks=window._EsriLeafletCallbacks||{};var n="c"+o;i.callback="window._EsriLeafletCallbacks."+n,window._EsriLeafletCallbacks[n]=function(t){if(!0!==window._EsriLeafletCallbacks[n]){var e,i=Object.prototype.toString.call(t);"[object Object]"!==i&&"[object Array]"!==i&&(e={error:{code:500,message:"Expected array or object as JSONP response"}},t=null),!e&&t.error&&(e=t,t=null),s.call(r,e,t),window._EsriLeafletCallbacks[n]=!0}};var l=e.DomUtil.create("script",null,document.body);return l.type="text/javascript",l.src=t+"?"+a(i),l.id=n,e.DomUtil.addClass(l,"esri-leaflet-jsonp"),o++,{id:n,url:l.src,abort:function(){window._EsriLeafletCallbacks._callback[n]({code:0,message:"Request aborted."})}}}var d=r.cors?h:p;d.CORS=h,d.JSONP=p;var m={request:c,get:d,post:u};function f(t){return function(t,e){for(var i=0;i<t.length;i++)if(t[i]!==e[i])return!1;return!0}(t[0],t[t.length-1])||t.push(t[0]),t}function y(t){for(var e,i=0,s=0,r=t.length,n=t[s];s<r-1;s++)i+=((e=t[s+1])[0]-n[0])*(e[1]+n[1]),n=e;return i>=0}function g(t,e,i,s){var r=(s[0]-i[0])*(t[1]-i[1])-(s[1]-i[1])*(t[0]-i[0]),n=(e[0]-t[0])*(t[1]-i[1])-(e[1]-t[1])*(t[0]-i[0]),o=(s[1]-i[1])*(e[0]-t[0])-(s[0]-i[0])*(e[1]-t[1]);if(0!==o){var a=r/o,l=n/o;if(a>=0&&a<=1&&l>=0&&l<=1)return!0}return!1}function v(t,e){for(var i=0;i<t.length-1;i++)for(var s=0;s<e.length-1;s++)if(g(t[i],t[i+1],e[s],e[s+1]))return!0;return!1}function _(t,e){var i=v(t,e),s=function(t,e){for(var i=!1,s=-1,r=t.length,n=r-1;++s<r;n=s)(t[s][1]<=e[1]&&e[1]<t[n][1]||t[n][1]<=e[1]&&e[1]<t[s][1])&&e[0]<(t[n][0]-t[s][0])*(e[1]-t[s][1])/(t[n][1]-t[s][1])+t[s][0]&&(i=!i);return i}(t,e[0]);return!(i||!s)}function b(t){var e=[],i=t.slice(0),s=f(i.shift().slice(0));if(s.length>=4){y(s)||s.reverse(),e.push(s);for(var r=0;r<i.length;r++){var n=f(i[r].slice(0));n.length>=4&&(y(n)&&n.reverse(),e.push(n))}}return e}function x(t){var e={};for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i]);return e}function L(t,e){var i={};if("number"==typeof t.x&&"number"==typeof t.y&&(i.type="Point",i.coordinates=[t.x,t.y],"number"==typeof t.z&&i.coordinates.push(t.z)),t.points&&(i.type="MultiPoint",i.coordinates=t.points.slice(0)),t.paths&&(1===t.paths.length?(i.type="LineString",i.coordinates=t.paths[0].slice(0)):(i.type="MultiLineString",i.coordinates=t.paths.slice(0))),t.rings&&(i=function(t){for(var e,i,s=[],r=[],n=0;n<t.length;n++){var o=f(t[n].slice(0));if(!(o.length<4))if(y(o)){var a=[o.slice().reverse()];s.push(a)}else r.push(o.slice().reverse())}for(var l=[];r.length;){i=r.pop();var u=!1;for(e=s.length-1;e>=0;e--)if(_(s[e][0],i)){s[e].push(i),u=!0;break}u||l.push(i)}for(;l.length;){i=l.pop();var h=!1;for(e=s.length-1;e>=0;e--)if(v(s[e][0],i)){s[e].push(i),h=!0;break}h||s.push([i.reverse()])}return 1===s.length?{type:"Polygon",coordinates:s[0]}:{type:"MultiPolygon",coordinates:s}}(t.rings.slice(0))),(t.geometry||t.attributes)&&(i.type="Feature",i.geometry=t.geometry?L(t.geometry):null,i.properties=t.attributes?x(t.attributes):null,t.attributes))try{i.id=function(t,e){for(var i=e?[e,"OBJECTID","FID"]:["OBJECTID","FID"],s=0;s<i.length;s++){var r=i[s];if(r in t&&("string"==typeof t[r]||"number"==typeof t[r]))return t[r]}throw Error("No valid id attribute found")}(t.attributes,e)}catch(t){}return JSON.stringify(i.geometry)===JSON.stringify({})&&(i.geometry=null),t.spatialReference&&t.spatialReference.wkid&&4326!==t.spatialReference.wkid&&console.warn("Object converted in non-standard crs - "+JSON.stringify(t.spatialReference)),i}function S(t,e){e=e||"OBJECTID";var i,s={wkid:4326},r={};switch(t.type){case"Point":r.x=t.coordinates[0],r.y=t.coordinates[1],r.spatialReference=s;break;case"MultiPoint":r.points=t.coordinates.slice(0),r.spatialReference=s;break;case"LineString":r.paths=[t.coordinates.slice(0)],r.spatialReference=s;break;case"MultiLineString":r.paths=t.coordinates.slice(0),r.spatialReference=s;break;case"Polygon":r.rings=b(t.coordinates.slice(0)),r.spatialReference=s;break;case"MultiPolygon":r.rings=function(t){for(var e=[],i=0;i<t.length;i++)for(var s=b(t[i]),r=s.length-1;r>=0;r--){var n=s[r].slice(0);e.push(n)}return e}(t.coordinates.slice(0)),r.spatialReference=s;break;case"Feature":t.geometry&&(r.geometry=S(t.geometry,e)),r.attributes=t.properties?x(t.properties):{},t.id&&(r.attributes[e]=t.id);break;case"FeatureCollection":for(r=[],i=0;i<t.features.length;i++)r.push(S(t.features[i],e));break;case"GeometryCollection":for(r=[],i=0;i<t.geometries.length;i++)r.push(S(t.geometries[i],e))}return r}function A(t,e){return S(t,e)}function I(t,e){return L(t,e)}function T(t){if("NaN"!==t.xmin&&"NaN"!==t.ymin&&"NaN"!==t.xmax&&"NaN"!==t.ymax){var i=e.latLng(t.ymin,t.xmin),s=e.latLng(t.ymax,t.xmax);return e.latLngBounds(i,s)}return null}function w(t){return{xmin:(t=e.latLngBounds(t)).getSouthWest().lng,ymin:t.getSouthWest().lat,xmax:t.getNorthEast().lng,ymax:t.getNorthEast().lat,spatialReference:{wkid:4326}}}var R=/^(OBJECTID|FID|OID|ID)$/i;function O(t){var e;if(t.objectIdFieldName)e=t.objectIdFieldName;else if(t.fields){for(var i=0;i<=t.fields.length-1;i++)if("esriFieldTypeOID"===t.fields[i].type){e=t.fields[i].name;break}if(!e)for(i=0;i<=t.fields.length-1;i++)if(t.fields[i].name.match(R)){e=t.fields[i].name;break}}return e}function C(t){for(var e in t.attributes)if(e.match(R))return e}function P(t,e){var i,s=t.features||t.results,r=s.length;i=e||O(t);var n={type:"FeatureCollection",features:[]};if(r)for(var o=s.length-1;o>=0;o--){var a=I(s[o],i||C(s[o]));n.features.push(a)}return n}function F(t){return"/"!==(t=e.Util.trim(t))[t.length-1]&&(t+="/"),t}function U(t){if(-1!==t.url.indexOf("?")){t.requestParams=t.requestParams||{};var e=t.url.substring(t.url.indexOf("?")+1);t.url=t.url.split("?")[0],t.requestParams=JSON.parse('{"'+decodeURI(e).replace(/"/g,'\\"').replace(/&/g,'","').replace(/=/g,'":"')+'"}')}return t.url=F(t.url.split("?")[0]),t}function k(t){return/^(?!.*utility\.arcgis\.com).*\.arcgis\.com.*FeatureServer/i.test(t)}function q(t){var e;switch(t){case"Point":e="esriGeometryPoint";break;case"MultiPoint":e="esriGeometryMultipoint";break;case"LineString":case"MultiLineString":e="esriGeometryPolyline";break;case"Polygon":case"MultiPolygon":e="esriGeometryPolygon"}return e}function M(){console&&console.warn&&console.warn.apply(console,arguments)}function G(t){return t.getSize().x-n.attributionWidthOffset+"px"}function D(t){if(t.attributionControl&&!t.attributionControl._esriAttributionAdded){t.attributionControl.setPrefix('<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | Powered by <a href="https://www.esri.com">Esri</a>');var i=document.createElement("style");i.type="text/css",i.innerHTML=".esri-truncated-attribution:hover {white-space: normal;}",document.getElementsByTagName("head")[0].appendChild(i),e.DomUtil.addClass(t.attributionControl._container,"esri-truncated-attribution:hover");var s=document.createElement("style");s.type="text/css",s.innerHTML=".esri-truncated-attribution {vertical-align: -3px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;display: inline-block;transition: 0s white-space;transition-delay: 1s;max-width: "+G(t)+";}",document.getElementsByTagName("head")[0].appendChild(s),e.DomUtil.addClass(t.attributionControl._container,"esri-truncated-attribution"),t.on("resize",function(e){t.attributionControl._container.style.maxWidth=G(e.target)}),t.on("unload",function(){i.parentNode.removeChild(i),s.parentNode.removeChild(s);for(var t=document.querySelectorAll(".esri-leaflet-jsonp"),e=0;e<t.length;e++)t.item(e).parentNode.removeChild(t.item(e))}),t.attributionControl._esriAttributionAdded=!0}}function E(t){var i={geometry:null,geometryType:null};return t instanceof e.LatLngBounds?(i.geometry=w(t),i.geometryType="esriGeometryEnvelope",i):(t.getLatLng&&(t=t.getLatLng()),t instanceof e.LatLng&&(t={type:"Point",coordinates:[t.lng,t.lat]}),t instanceof e.GeoJSON&&(t=t.getLayers()[0].feature.geometry,i.geometry=A(t),i.geometryType=q(t.type)),t.toGeoJSON&&(t=t.toGeoJSON()),"Feature"===t.type&&(t=t.geometry),"Point"===t.type||"LineString"===t.type||"Polygon"===t.type||"MultiPolygon"===t.type?(i.geometry=A(t),i.geometryType=q(t.type),i):void M("invalid geometry passed to spatial query. Should be L.LatLng, L.LatLngBounds, L.Marker or a GeoJSON Point, Line, Polygon or MultiPolygon object"))}function B(t,i){p(t,{},e.Util.bind(function(t,s){if(!t){i._esriAttributions=[];for(var r=0;r<s.contributors.length;r++)for(var n=s.contributors[r],o=0;o<n.coverageAreas.length;o++){var a=n.coverageAreas[o],l=e.latLng(a.bbox[0],a.bbox[1]),u=e.latLng(a.bbox[2],a.bbox[3]);i._esriAttributions.push({attribution:n.attribution,score:a.score,bounds:e.latLngBounds(l,u),minZoom:a.zoomMin,maxZoom:a.zoomMax})}i._esriAttributions.sort(function(t,e){return e.score-t.score}),z({target:i})}},this))}function z(t){var i=t.target,s=i._esriAttributions;if(i&&i.attributionControl&&s){for(var r="",n=i.getBounds(),o=e.latLngBounds(n.getSouthWest().wrap(),n.getNorthEast().wrap()),a=i.getZoom(),l=0;l<s.length;l++){var u=s[l],h=u.attribution;!r.match(h)&&u.bounds.intersects(o)&&a>=u.minZoom&&a<=u.maxZoom&&(r+=", "+h)}r=r.substr(2);var c=i.attributionControl._container.querySelector(".esri-dynamic-attribution");c.innerHTML=r,c.style.maxWidth=G(i),i.fire("attributionupdated",{attribution:r})}}var N={warn:M,cleanUrl:F,getUrlParams:U,isArcgisOnline:k,geojsonTypeToArcGIS:q,responseToFeatureCollection:P,geojsonToArcGIS:A,arcgisToGeoJSON:I,boundsToExtent:w,extentToBounds:T,calcAttributionWidth:G,setEsriAttribution:D,_setGeometry:E,_getAttributionData:B,_updateMapAttribution:z,_findIdAttributeFromFeature:C,_findIdAttributeFromResponse:O},j=e.Class.extend({options:{proxy:!1,useCors:i},generateSetter:function(t,i){return e.Util.bind(function(e){return this.params[t]=e,this},i)},initialize:function(t){if(t.request&&t.options?(this._service=t,e.Util.setOptions(this,t.options)):(e.Util.setOptions(this,t),this.options.url=F(t.url)),this.params=e.Util.extend({},this.params||{}),this.setters)for(var i in this.setters){var s=this.setters[i];this[i]=this.generateSetter(s,this)}},token:function(t){return this._service?this._service.authenticate(t):this.params.token=t,this},format:function(t){return this.params.returnUnformattedValues=!t,this},request:function(t,i){return this.options.requestParams&&e.Util.extend(this.params,this.options.requestParams),this._service?this._service.request(this.path,this.params,t,i):this._request("request",this.path,this.params,t,i)},_request:function(t,e,i,s,r){var n=this.options.proxy?this.options.proxy+"?"+this.options.url+e:this.options.url+e;return"get"!==t&&"request"!==t||this.options.useCors?m[t](n,i,s,r):m.get.JSONP(n,i,s,r)}});var Z=j.extend({setters:{offset:"resultOffset",limit:"resultRecordCount",fields:"outFields",precision:"geometryPrecision",featureIds:"objectIds",returnGeometry:"returnGeometry",returnM:"returnM",transform:"datumTransformation",token:"token"},path:"query",params:{returnGeometry:!0,where:"1=1",outSr:4326,outFields:"*"},within:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelContains",this},intersects:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelIntersects",this},contains:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelWithin",this},crosses:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelCrosses",this},touches:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelTouches",this},overlaps:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelOverlaps",this},bboxIntersects:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelEnvelopeIntersects",this},indexIntersects:function(t){return this._setGeometryParams(t),this.params.spatialRel="esriSpatialRelIndexIntersects",this},nearby:function(t,i){return t=e.latLng(t),this.params.geometry=[t.lng,t.lat],this.params.geometryType="esriGeometryPoint",this.params.spatialRel="esriSpatialRelIntersects",this.params.units="esriSRUnit_Meter",this.params.distance=i,this.params.inSr=4326,this},where:function(t){return this.params.where=t,this},between:function(t,e){return this.params.time=[t.valueOf(),e.valueOf()],this},simplify:function(t,e){var i=Math.abs(t.getBounds().getWest()-t.getBounds().getEast());return this.params.maxAllowableOffset=i/t.getSize().y*e,this},orderBy:function(t,e){return e=e||"ASC",this.params.orderByFields=this.params.orderByFields?this.params.orderByFields+",":"",this.params.orderByFields+=[t,e].join(" "),this},run:function(t,e){return this._cleanParams(),this.options.isModern||k(this.options.url)?(this.params.f="geojson",this.request(function(i,s){this._trapSQLerrors(i),t.call(e,i,s,s)},this)):this.request(function(i,s){this._trapSQLerrors(i),t.call(e,i,s&&P(s),s)},this)},count:function(t,e){return this._cleanParams(),this.params.returnCountOnly=!0,this.request(function(e,i){t.call(this,e,i&&i.count,i)},e)},ids:function(t,e){return this._cleanParams(),this.params.returnIdsOnly=!0,this.request(function(e,i){t.call(this,e,i&&i.objectIds,i)},e)},bounds:function(t,e){return this._cleanParams(),this.params.returnExtentOnly=!0,this.request(function(i,s){s&&s.extent&&T(s.extent)?t.call(e,i,T(s.extent),s):(i={message:"Invalid Bounds"},t.call(e,i,null,s))},e)},distinct:function(){return this.params.returnGeometry=!1,this.params.returnDistinctValues=!0,this},pixelSize:function(t){var i=e.point(t);return this.params.pixelSize=[i.x,i.y],this},layer:function(t){return this.path=t+"/query",this},_trapSQLerrors:function(t){t&&"400"===t.code&&M("one common syntax error in query requests is encasing string values in double quotes instead of single quotes")},_cleanParams:function(){delete this.params.returnIdsOnly,delete this.params.returnExtentOnly,delete this.params.returnCountOnly},_setGeometryParams:function(t){this.params.inSr=4326;var e=E(t);this.params.geometry=e.geometry,this.params.geometryType=e.geometryType}});function J(t){return new Z(t)}var W=j.extend({setters:{contains:"contains",text:"searchText",fields:"searchFields",spatialReference:"sr",sr:"sr",layers:"layers",returnGeometry:"returnGeometry",maxAllowableOffset:"maxAllowableOffset",precision:"geometryPrecision",dynamicLayers:"dynamicLayers",returnZ:"returnZ",returnM:"returnM",gdbVersion:"gdbVersion",token:"token"},path:"find",params:{sr:4326,contains:!0,returnGeometry:!0,returnZ:!0,returnM:!1},layerDefs:function(t,e){return this.params.layerDefs=this.params.layerDefs?this.params.layerDefs+";":"",this.params.layerDefs+=[t,e].join(":"),this},simplify:function(t,e){var i=Math.abs(t.getBounds().getWest()-t.getBounds().getEast());return this.params.maxAllowableOffset=i/t.getSize().y*e,this},run:function(t,e){return this.request(function(i,s){t.call(e,i,s&&P(s),s)},e)}});function Q(t){return new W(t)}var V=j.extend({path:"identify",between:function(t,e){return this.params.time=[t.valueOf(),e.valueOf()],this}});var H=V.extend({setters:{layers:"layers",precision:"geometryPrecision",tolerance:"tolerance",returnGeometry:"returnGeometry"},params:{sr:4326,layers:"all",tolerance:3,returnGeometry:!0},on:function(t){var e=w(t.getBounds()),i=t.getSize();return this.params.imageDisplay=[i.x,i.y,96],this.params.mapExtent=[e.xmin,e.ymin,e.xmax,e.ymax],this},at:function(t){return 2===t.length&&(t=e.latLng(t)),this._setGeometryParams(t),this},layerDef:function(t,e){return this.params.layerDefs=this.params.layerDefs?this.params.layerDefs+";":"",this.params.layerDefs+=[t,e].join(":"),this},simplify:function(t,e){var i=Math.abs(t.getBounds().getWest()-t.getBounds().getEast());return this.params.maxAllowableOffset=i/t.getSize().y*e,this},run:function(t,e){return this.request(function(i,s){if(i)t.call(e,i,void 0,s);else{var r=P(s);s.results=s.results.reverse();for(var n=0;n<r.features.length;n++){r.features[n].layerId=s.results[n].layerId}t.call(e,void 0,r,s)}})},_setGeometryParams:function(t){var e=E(t);this.params.geometry=e.geometry,this.params.geometryType=e.geometryType}});function K(t){return new H(t)}var X=V.extend({setters:{setMosaicRule:"mosaicRule",setRenderingRule:"renderingRule",setPixelSize:"pixelSize",returnCatalogItems:"returnCatalogItems",returnGeometry:"returnGeometry"},params:{returnGeometry:!1},at:function(t){return t=e.latLng(t),this.params.geometry=JSON.stringify({x:t.lng,y:t.lat,spatialReference:{wkid:4326}}),this.params.geometryType="esriGeometryPoint",this},getMosaicRule:function(){return this.params.mosaicRule},getRenderingRule:function(){return this.params.renderingRule},getPixelSize:function(){return this.params.pixelSize},run:function(t,e){return this.request(function(i,s){t.call(e,i,s&&this._responseToGeoJSON(s),s)},this)},_responseToGeoJSON:function(t){var e=t.location,i=t.catalogItems,s=t.catalogItemVisibilities,r={pixel:{type:"Feature",geometry:{type:"Point",coordinates:[e.x,e.y]},crs:{type:"EPSG",properties:{code:e.spatialReference.wkid}},properties:{OBJECTID:t.objectId,name:t.name,value:t.value},id:t.objectId}};if(t.properties&&t.properties.Values&&(r.pixel.properties.values=t.properties.Values),i&&i.features&&(r.catalogItems=P(i),s&&s.length===r.catalogItems.features.length))for(var n=s.length-1;n>=0;n--)r.catalogItems.features[n].properties.catalogItemVisibility=s[n];return r}});function $(t){return new X(t)}var Y=e.Evented.extend({options:{proxy:!1,useCors:i,timeout:0},initialize:function(t){t=t||{},this._requestQueue=[],this._authenticating=!1,e.Util.setOptions(this,t),this.options.url=F(this.options.url)},get:function(t,e,i,s){return this._request("get",t,e,i,s)},post:function(t,e,i,s){return this._request("post",t,e,i,s)},request:function(t,e,i,s){return this._request("request",t,e,i,s)},metadata:function(t,e){return this._request("get","",{},t,e)},authenticate:function(t){return this._authenticating=!1,this.options.token=t,this._runQueue(),this},getTimeout:function(){return this.options.timeout},setTimeout:function(t){this.options.timeout=t},_request:function(t,i,s,r,n){this.fire("requeststart",{url:this.options.url+i,params:s,method:t},!0);var o=this._createServiceCallback(t,i,s,r,n);if(this.options.token&&(s.token=this.options.token),this.options.requestParams&&e.Util.extend(s,this.options.requestParams),!this._authenticating){var a=this.options.proxy?this.options.proxy+"?"+this.options.url+i:this.options.url+i;return"get"!==t&&"request"!==t||this.options.useCors?m[t](a,s,o,n):m.get.JSONP(a,s,o,n)}this._requestQueue.push([t,i,s,r,n])},_createServiceCallback:function(t,i,s,r,n){return e.Util.bind(function(o,a){!o||499!==o.code&&498!==o.code||(this._authenticating=!0,this._requestQueue.push([t,i,s,r,n]),this.fire("authenticationrequired",{authenticate:e.Util.bind(this.authenticate,this)},!0),o.authenticate=e.Util.bind(this.authenticate,this)),r.call(n,o,a),o?this.fire("requesterror",{url:this.options.url+i,params:s,message:o.message,code:o.code,method:t},!0):this.fire("requestsuccess",{url:this.options.url+i,params:s,response:a,method:t},!0),this.fire("requestend",{url:this.options.url+i,params:s,method:t},!0)},this)},_runQueue:function(){for(var t=this._requestQueue.length-1;t>=0;t--){var e=this._requestQueue[t];this[e.shift()].apply(this,e)}this._requestQueue=[]}});var tt=Y.extend({identify:function(){return K(this)},find:function(){return Q(this)},query:function(){return J(this)}});function et(t){return new tt(t)}var it=Y.extend({query:function(){return J(this)},identify:function(){return $(this)}});function st(t){return new it(t)}var rt=Y.extend({options:{idAttribute:"OBJECTID"},query:function(){return J(this)},addFeature:function(t,e,i){return delete t.id,t=A(t),this.post("addFeatures",{features:[t]},function(t,s){var r=s&&s.addResults?s.addResults[0]:void 0;e&&e.call(i,t||s.addResults[0].error,r)},i)},updateFeature:function(t,e,i){return t=A(t,this.options.idAttribute),this.post("updateFeatures",{features:[t]},function(t,s){var r=s&&s.updateResults?s.updateResults[0]:void 0;e&&e.call(i,t||s.updateResults[0].error,r)},i)},deleteFeature:function(t,e,i){return this.post("deleteFeatures",{objectIds:t},function(t,s){var r=s&&s.deleteResults?s.deleteResults[0]:void 0;e&&e.call(i,t||s.deleteResults[0].error,r)},i)},deleteFeatures:function(t,e,i){return this.post("deleteFeatures",{objectIds:t},function(t,s){var r=s&&s.deleteResults?s.deleteResults:void 0;e&&e.call(i,t||s.deleteResults[0].error,r)},i)}});function nt(t){return new rt(t)}var ot="https:"!==window.location.protocol?"http:":"https:",at=e.TileLayer.extend({statics:{TILES:{Streets:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],attribution:"USGS, NOAA",attributionUrl:"https://static.arcgis.com/attribution/World_Street_Map"}},Topographic:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],attribution:"USGS, NOAA",attributionUrl:"https://static.arcgis.com/attribution/World_Topo_Map"}},Oceans:{urlTemplate:ot+"//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],attribution:"USGS, NOAA",attributionUrl:"https://static.arcgis.com/attribution/Ocean_Basemap"}},OceansLabels:{urlTemplate:ot+"//{s}.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],pane:s?"esri-labels":"tilePane"}},NationalGeographic:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],attribution:"National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp."}},DarkGray:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],attribution:"HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors"}},DarkGrayLabels:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],pane:s?"esri-labels":"tilePane",attribution:""}},Gray:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],attribution:"HERE, DeLorme, MapmyIndia, &copy; OpenStreetMap contributors"}},GrayLabels:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:16,subdomains:["server","services"],pane:s?"esri-labels":"tilePane",attribution:""}},Imagery:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],attribution:"DigitalGlobe, GeoEye, i-cubed, USDA, USGS, AEX, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community",attributionUrl:"https://static.arcgis.com/attribution/World_Imagery"}},ImageryLabels:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],pane:s?"esri-labels":"tilePane",attribution:""}},ImageryTransportation:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,subdomains:["server","services"],pane:s?"esri-labels":"tilePane"}},ShadedRelief:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:13,subdomains:["server","services"],attribution:"USGS"}},ShadedReliefLabels:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places_Alternate/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:12,subdomains:["server","services"],pane:s?"esri-labels":"tilePane",attribution:""}},Terrain:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:13,subdomains:["server","services"],attribution:"USGS, NOAA"}},TerrainLabels:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:13,subdomains:["server","services"],pane:s?"esri-labels":"tilePane",attribution:""}},USATopo:{urlTemplate:ot+"//{s}.arcgisonline.com/ArcGIS/rest/services/USA_Topo_Maps/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:15,subdomains:["server","services"],attribution:"USGS, National Geographic Society, i-cubed"}},ImageryClarity:{urlTemplate:ot+"//clarity.maptiles.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",options:{minZoom:1,maxZoom:19,attribution:"Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community"}}}},initialize:function(t,i){var s;if("object"==typeof t&&t.urlTemplate&&t.options)s=t;else{if("string"!=typeof t||!at.TILES[t])throw new Error('L.esri.BasemapLayer: Invalid parameter. Use one of "Streets", "Topographic", "Oceans", "OceansLabels", "NationalGeographic", "Gray", "GrayLabels", "DarkGray", "DarkGrayLabels", "Imagery", "ImageryLabels", "ImageryTransportation", "ImageryClarity", "ShadedRelief", "ShadedReliefLabels", "Terrain", "TerrainLabels" or "USATopo"');s=at.TILES[t]}var r=e.Util.extend(s.options,i);e.Util.setOptions(this,r),this.options.token&&(s.urlTemplate+="?token="+this.options.token),e.TileLayer.prototype.initialize.call(this,s.urlTemplate,r)},onAdd:function(t){D(t),"esri-labels"===this.options.pane&&this._initPane(),this.options.attributionUrl&&B(this.options.attributionUrl,t),t.on("moveend",z),e.TileLayer.prototype.onAdd.call(this,t)},onRemove:function(t){t.off("moveend",z),e.TileLayer.prototype.onRemove.call(this,t)},_initPane:function(){if(!this._map.getPane(this.options.pane)){var t=this._map.createPane(this.options.pane);t.style.pointerEvents="none",t.style.zIndex=500}},getAttribution:function(){if(this.options.attribution)var t='<span class="esri-dynamic-attribution">'+this.options.attribution+"</span>";return t}});var lt=e.TileLayer.extend({options:{zoomOffsetAllowance:.1,errorTileUrl:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEABAMAAACuXLVVAAAAA1BMVEUzNDVszlHHAAAAAXRSTlMAQObYZgAAAAlwSFlzAAAAAAAAAAAB6mUWpAAAADZJREFUeJztwQEBAAAAgiD/r25IQAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7waBAAABw08RwAAAAABJRU5ErkJggg=="},statics:{MercatorZoomLevels:{0:156543.033928,1:78271.5169639999,2:39135.7584820001,3:19567.8792409999,4:9783.93962049996,5:4891.96981024998,6:2445.98490512499,7:1222.99245256249,8:611.49622628138,9:305.748113140558,10:152.874056570411,11:76.4370282850732,12:38.2185141425366,13:19.1092570712683,14:9.55462853563415,15:4.77731426794937,16:2.38865713397468,17:1.19432856685505,18:.597164283559817,19:.298582141647617,20:.14929107082381,21:.07464553541191,22:.0373227677059525,23:.0186613838529763}},initialize:function(t){t=U(t=e.Util.setOptions(this,t)),this.tileUrl=(t.proxy?t.proxy+"?":"")+t.url+"tile/{z}/{y}/{x}"+(t.requestParams&&Object.keys(t.requestParams).length>0?e.Util.getParamString(t.requestParams):""),-1!==t.url.indexOf("{s}")&&t.subdomains&&(t.url=t.url.replace("{s}",t.subdomains[0])),this.service=et(t),this.service.addEventParent(this),new RegExp(/tiles.arcgis(online)?\.com/g).test(t.url)&&(this.tileUrl=this.tileUrl.replace("://tiles","://tiles{s}"),t.subdomains=["1","2","3","4"]),this.options.token&&(this.tileUrl+="?token="+this.options.token),e.TileLayer.prototype.initialize.call(this,this.tileUrl,t)},getTileUrl:function(t){var i=this._getZoomForUrl();return e.Util.template(this.tileUrl,e.Util.extend({s:this._getSubdomain(t),x:t.x,y:t.y,z:this._lodMap&&this._lodMap[i]?this._lodMap[i]:i},this.options))},createTile:function(t,i){var s=document.createElement("img");return e.DomEvent.on(s,"load",e.Util.bind(this._tileOnLoad,this,i,s)),e.DomEvent.on(s,"error",e.Util.bind(this._tileOnError,this,i,s)),this.options.crossOrigin&&(s.crossOrigin=""),s.alt="",!this._lodMap||this._lodMap&&this._lodMap[this._getZoomForUrl()]?s.src=this.getTileUrl(t):this.once("lodmap",function(){s.src=this.getTileUrl(t)},this),s},onAdd:function(t){D(t),this._lodMap||this.metadata(function(i,s){if(!i&&s.spatialReference){var r=s.spatialReference.latestWkid||s.spatialReference.wkid;if(!this.options.attribution&&t.attributionControl&&s.copyrightText&&(this.options.attribution=s.copyrightText,t.attributionControl.addAttribution(this.getAttribution())),t.options.crs!==e.CRS.EPSG3857||102100!==r&&3857!==r)t.options.crs&&t.options.crs.code&&t.options.crs.code.indexOf(r)>-1||M("L.esri.TiledMapLayer is using a non-mercator spatial reference. Support may be available through Proj4Leaflet http://esri.github.io/esri-leaflet/examples/non-mercator-projection.html");else{this._lodMap={};for(var n=s.tileInfo.lods,o=lt.MercatorZoomLevels,a=0;a<n.length;a++){var l=n[a];for(var u in o){var h=o[u];if(this._withinPercentage(l.resolution,h,this.options.zoomOffsetAllowance)){this._lodMap[u]=l.level;break}}}this.fire("lodmap")}}},this),e.TileLayer.prototype.onAdd.call(this,t)},metadata:function(t,e){return this.service.metadata(t,e),this},identify:function(){return this.service.identify()},find:function(){return this.service.find()},query:function(){return this.service.query()},authenticate:function(t){var e="?token="+t;return this.tileUrl=this.options.token?this.tileUrl.replace(/\?token=(.+)/g,e):this.tileUrl+e,this.options.token=t,this.service.authenticate(t),this},_withinPercentage:function(t,e,i){return Math.abs(t/e-1)<i}});var ut=e.ImageOverlay.extend({onAdd:function(t){this._topLeft=t.getPixelBounds().min,e.ImageOverlay.prototype.onAdd.call(this,t)},_reset:function(){this._map.options.crs===e.CRS.EPSG3857?e.ImageOverlay.prototype._reset.call(this):e.DomUtil.setPosition(this._image,this._topLeft.subtract(this._map.getPixelOrigin()))}}),ht=e.Layer.extend({options:{opacity:1,position:"front",f:"image",useCors:i,attribution:null,interactive:!1,alt:""},onAdd:function(t){D(t),this._update=e.Util.throttle(this._update,this.options.updateInterval,this),t.on("moveend",this._update,this),this._currentImage&&this._currentImage._bounds.equals(this._map.getBounds())?t.addLayer(this._currentImage):this._currentImage&&(this._map.removeLayer(this._currentImage),this._currentImage=null),this._update(),this._popup&&(this._map.on("click",this._getPopupData,this),this._map.on("dblclick",this._resetPopupState,this)),this.metadata(function(e,i){!e&&!this.options.attribution&&t.attributionControl&&i.copyrightText&&(this.options.attribution=i.copyrightText,t.attributionControl.addAttribution(this.getAttribution()))},this)},onRemove:function(t){this._currentImage&&this._map.removeLayer(this._currentImage),this._popup&&(this._map.off("click",this._getPopupData,this),this._map.off("dblclick",this._resetPopupState,this)),this._map.off("moveend",this._update,this)},bindPopup:function(t,i){return this._shouldRenderPopup=!1,this._lastClick=!1,this._popup=e.popup(i),this._popupFunction=t,this._map&&(this._map.on("click",this._getPopupData,this),this._map.on("dblclick",this._resetPopupState,this)),this},unbindPopup:function(){return this._map&&(this._map.closePopup(this._popup),this._map.off("click",this._getPopupData,this),this._map.off("dblclick",this._resetPopupState,this)),this._popup=!1,this},bringToFront:function(){return this.options.position="front",this._currentImage&&this._currentImage.bringToFront(),this},bringToBack:function(){return this.options.position="back",this._currentImage&&this._currentImage.bringToBack(),this},getAttribution:function(){return this.options.attribution},getOpacity:function(){return this.options.opacity},setOpacity:function(t){return this.options.opacity=t,this._currentImage&&this._currentImage.setOpacity(t),this},getTimeRange:function(){return[this.options.from,this.options.to]},setTimeRange:function(t,e){return this.options.from=t,this.options.to=e,this._update(),this},metadata:function(t,e){return this.service.metadata(t,e),this},authenticate:function(t){return this.service.authenticate(t),this},redraw:function(){this._update()},_renderImage:function(t,e,i){if(this._map){i&&(t="data:"+i+";base64,"+t);var s=new ut(t,e,{opacity:0,crossOrigin:this.options.useCors,alt:this.options.alt,pane:this.options.pane||this.getPane(),interactive:this.options.interactive}).addTo(this._map),r=function(t){if(s.off("error",r,this),this._map){var i=t.target,n=this._currentImage;i._bounds.equals(e)&&i._bounds.equals(this._map.getBounds())?(this._currentImage=i,"front"===this.options.position?this.bringToFront():this.bringToBack(),this._map&&this._currentImage._map?this._currentImage.setOpacity(this.options.opacity):this._currentImage._map.removeLayer(this._currentImage),n&&this._map&&this._map.removeLayer(n),n&&n._map&&n._map.removeLayer(n)):this._map.removeLayer(i)}this.fire("load",{bounds:e})};s.once("error",function(){this._map.removeLayer(s),this.fire("error"),s.off("load",r,this)},this),s.once("load",r,this),this.fire("loading",{bounds:e})}},_update:function(){if(this._map){var t=this._map.getZoom(),i=this._map.getBounds();if(!(this._animatingZoom||this._map._panTransition&&this._map._panTransition._inProgress))if(t>this.options.maxZoom||t<this.options.minZoom)this._currentImage&&(this._currentImage._map.removeLayer(this._currentImage),this._currentImage=null);else{var s=this._buildExportParams();e.Util.extend(s,this.options.requestParams),s?this._requestExport(s,i):this._currentImage&&(this._currentImage._map.removeLayer(this._currentImage),this._currentImage=null)}}},_renderPopup:function(t,i,s,r){if(t=e.latLng(t),this._shouldRenderPopup&&this._lastClick.equals(t)){var n=this._popupFunction(i,s,r);n&&this._popup.setLatLng(t).setContent(n).openOn(this._map)}},_resetPopupState:function(t){this._shouldRenderPopup=!1,this._lastClick=t.latlng},_calculateBbox:function(){var t=this._map.getPixelBounds(),i=this._map.unproject(t.getBottomLeft()),s=this._map.unproject(t.getTopRight()),r=this._map.options.crs.project(s),n=this._map.options.crs.project(i),o=e.bounds(r,n);return[o.getBottomLeft().x,o.getBottomLeft().y,o.getTopRight().x,o.getTopRight().y].join(",")},_calculateImageSize:function(){var t=this._map.getPixelBounds(),e=this._map.getSize(),i=this._map.unproject(t.getBottomLeft()),s=this._map.unproject(t.getTopRight()),r=this._map.latLngToLayerPoint(s).y,n=this._map.latLngToLayerPoint(i).y;return(r>0||n<e.y)&&(e.y=n-r),e.x+","+e.y}}),ct=ht.extend({options:{updateInterval:150,format:"jpgpng",transparent:!0,f:"image"},query:function(){return this.service.query()},identify:function(){return this.service.identify()},initialize:function(t){t=U(t),this.service=st(t),this.service.addEventParent(this),e.Util.setOptions(this,t)},setPixelType:function(t){return this.options.pixelType=t,this._update(),this},getPixelType:function(){return this.options.pixelType},setBandIds:function(t){return e.Util.isArray(t)?this.options.bandIds=t.join(","):this.options.bandIds=t.toString(),this._update(),this},getBandIds:function(){return this.options.bandIds},setNoData:function(t,i){return e.Util.isArray(t)?this.options.noData=t.join(","):this.options.noData=t.toString(),i&&(this.options.noDataInterpretation=i),this._update(),this},getNoData:function(){return this.options.noData},getNoDataInterpretation:function(){return this.options.noDataInterpretation},setRenderingRule:function(t){this.options.renderingRule=t,this._update()},getRenderingRule:function(){return this.options.renderingRule},setMosaicRule:function(t){this.options.mosaicRule=t,this._update()},getMosaicRule:function(){return this.options.mosaicRule},_getPopupData:function(t){var i=e.Util.bind(function(i,s,r){i||setTimeout(e.Util.bind(function(){this._renderPopup(t.latlng,i,s,r)},this),300)},this),s=this.identify().at(t.latlng);this.options.mosaicRule&&s.setMosaicRule(this.options.mosaicRule),s.run(i),this._shouldRenderPopup=!0,this._lastClick=t.latlng},_buildExportParams:function(){var t=parseInt(this._map.options.crs.code.split(":")[1],10),e={bbox:this._calculateBbox(),size:this._calculateImageSize(),format:this.options.format,transparent:this.options.transparent,bboxSR:t,imageSR:t};return this.options.from&&this.options.to&&(e.time=this.options.from.valueOf()+","+this.options.to.valueOf()),this.options.pixelType&&(e.pixelType=this.options.pixelType),this.options.interpolation&&(e.interpolation=this.options.interpolation),this.options.compressionQuality&&(e.compressionQuality=this.options.compressionQuality),this.options.bandIds&&(e.bandIds=this.options.bandIds),(0===this.options.noData||this.options.noData)&&(e.noData=this.options.noData),this.options.noDataInterpretation&&(e.noDataInterpretation=this.options.noDataInterpretation),this.service.options.token&&(e.token=this.service.options.token),this.options.renderingRule&&(e.renderingRule=JSON.stringify(this.options.renderingRule)),this.options.mosaicRule&&(e.mosaicRule=JSON.stringify(this.options.mosaicRule)),e},_requestExport:function(t,i){"json"===this.options.f?this.service.request("exportImage",t,function(t,e){t||(this.options.token&&(e.href+="?token="+this.options.token),this._renderImage(e.href,i))},this):(t.f="image",this._renderImage(this.options.url+"exportImage"+e.Util.getParamString(t),i))}});var pt=ht.extend({options:{updateInterval:150,layers:!1,layerDefs:!1,timeOptions:!1,format:"png24",transparent:!0,f:"json"},initialize:function(t){t=U(t),this.service=et(t),this.service.addEventParent(this),(t.proxy||t.token)&&"json"!==t.f&&(t.f="json"),e.Util.setOptions(this,t)},getDynamicLayers:function(){return this.options.dynamicLayers},setDynamicLayers:function(t){return this.options.dynamicLayers=t,this._update(),this},getLayers:function(){return this.options.layers},setLayers:function(t){return this.options.layers=t,this._update(),this},getLayerDefs:function(){return this.options.layerDefs},setLayerDefs:function(t){return this.options.layerDefs=t,this._update(),this},getTimeOptions:function(){return this.options.timeOptions},setTimeOptions:function(t){return this.options.timeOptions=t,this._update(),this},query:function(){return this.service.query()},identify:function(){return this.service.identify()},find:function(){return this.service.find()},_getPopupData:function(t){var i,s=e.Util.bind(function(i,s,r){i||setTimeout(e.Util.bind(function(){this._renderPopup(t.latlng,i,s,r)},this),300)},this);if((i=this.options.popup?this.options.popup.on(this._map).at(t.latlng):this.identify().on(this._map).at(t.latlng)).params.maxAllowableOffset||i.simplify(this._map,.5),this.options.popup&&this.options.popup.params&&this.options.popup.params.layers||(this.options.layers?i.layers("visible:"+this.options.layers.join(",")):i.layers("visible")),this.options.layerDefs&&"string"!=typeof this.options.layerDefs&&!i.params.layerDefs)for(var r in this.options.layerDefs)this.options.layerDefs.hasOwnProperty(r)&&i.layerDef(r,this.options.layerDefs[r]);i.run(s),this._shouldRenderPopup=!0,this._lastClick=t.latlng},_buildExportParams:function(){var t=parseInt(this._map.options.crs.code.split(":")[1],10),e={bbox:this._calculateBbox(),size:this._calculateImageSize(),dpi:96,format:this.options.format,transparent:this.options.transparent,bboxSR:t,imageSR:t};if(this.options.dynamicLayers&&(e.dynamicLayers=this.options.dynamicLayers),this.options.layers){if(0===this.options.layers.length)return;e.layers="show:"+this.options.layers.join(",")}return this.options.layerDefs&&(e.layerDefs="string"==typeof this.options.layerDefs?this.options.layerDefs:JSON.stringify(this.options.layerDefs)),this.options.timeOptions&&(e.timeOptions=JSON.stringify(this.options.timeOptions)),this.options.from&&this.options.to&&(e.time=this.options.from.valueOf()+","+this.options.to.valueOf()),this.service.options.token&&(e.token=this.service.options.token),this.options.proxy&&(e.proxy=this.options.proxy),this.options.disableCache&&(e._ts=Date.now()),e},_requestExport:function(t,i){"json"===this.options.f?this.service.request("export",t,function(t,e){t||(this.options.token&&(e.href+="?token="+this.options.token),this.options.proxy&&(e.href=this.options.proxy+"?"+e.href),e.href?this._renderImage(e.href,i):this._renderImage(e.imageData,i,e.contentType))},this):(t.f="image",this._renderImage(this.options.url+"export"+e.Util.getParamString(t),i))}});var dt=e.Layer.extend({options:{cellSize:512,updateInterval:150},initialize:function(t){t=e.setOptions(this,t),this._zooming=!1},onAdd:function(t){this._map=t,this._update=e.Util.throttle(this._update,this.options.updateInterval,this),this._reset(),this._update()},onRemove:function(){this._map.removeEventListener(this.getEvents(),this),this._removeCells()},getEvents:function(){return{moveend:this._update,zoomstart:this._zoomstart,zoomend:this._reset}},addTo:function(t){return t.addLayer(this),this},removeFrom:function(t){return t.removeLayer(this),this},_zoomstart:function(){this._zooming=!0},_reset:function(){this._removeCells(),this._cells={},this._activeCells={},this._cellsToLoad=0,this._cellsTotal=0,this._cellNumBounds=this._getCellNumBounds(),this._resetWrap(),this._zooming=!1},_resetWrap:function(){var t=this._map,e=t.options.crs;if(!e.infinite){var i=this._getCellSize();e.wrapLng&&(this._wrapLng=[Math.floor(t.project([0,e.wrapLng[0]]).x/i),Math.ceil(t.project([0,e.wrapLng[1]]).x/i)]),e.wrapLat&&(this._wrapLat=[Math.floor(t.project([e.wrapLat[0],0]).y/i),Math.ceil(t.project([e.wrapLat[1],0]).y/i)])}},_getCellSize:function(){return this.options.cellSize},_update:function(){if(this._map){var t=this._map.getPixelBounds(),i=this._getCellSize(),s=e.bounds(t.min.divideBy(i).floor(),t.max.divideBy(i).floor());this._removeOtherCells(s),this._addCells(s),this.fire("cellsupdated")}},_addCells:function(t){var i,s,r,n=[],o=t.getCenter(),a=this._map.getZoom();for(i=t.min.y;i<=t.max.y;i++)for(s=t.min.x;s<=t.max.x;s++)(r=e.point(s,i)).z=a,this._isValidCell(r)&&n.push(r);var l=n.length;if(0!==l)for(this._cellsToLoad+=l,this._cellsTotal+=l,n.sort(function(t,e){return t.distanceTo(o)-e.distanceTo(o)}),s=0;s<l;s++)this._addCell(n[s])},_isValidCell:function(t){var i=this._map.options.crs;if(!i.infinite){var s=this._cellNumBounds;if(!i.wrapLng&&(t.x<s.min.x||t.x>s.max.x)||!i.wrapLat&&(t.y<s.min.y||t.y>s.max.y))return!1}if(!this.options.bounds)return!0;var r=this._cellCoordsToBounds(t);return e.latLngBounds(this.options.bounds).intersects(r)},_cellCoordsToBounds:function(t){var i=this._map,s=this.options.cellSize,r=t.multiplyBy(s),n=r.add([s,s]),o=i.wrapLatLng(i.unproject(r,t.z)),a=i.wrapLatLng(i.unproject(n,t.z));return e.latLngBounds(o,a)},_cellCoordsToKey:function(t){return t.x+":"+t.y},_keyToCellCoords:function(t){var i=t.split(":"),s=parseInt(i[0],10),r=parseInt(i[1],10);return e.point(s,r)},_removeOtherCells:function(t){for(var e in this._cells)t.contains(this._keyToCellCoords(e))||this._removeCell(e)},_removeCell:function(t){var e=this._activeCells[t];e&&(delete this._activeCells[t],this.cellLeave&&this.cellLeave(e.bounds,e.coords),this.fire("cellleave",{bounds:e.bounds,coords:e.coords}))},_removeCells:function(){for(var t in this._cells){var e=this._cells[t].bounds,i=this._cells[t].coords;this.cellLeave&&this.cellLeave(e,i),this.fire("cellleave",{bounds:e,coords:i})}},_addCell:function(t){this._wrapCoords(t);var e=this._cellCoordsToKey(t),i=this._cells[e];i&&!this._activeCells[e]&&(this.cellEnter&&this.cellEnter(i.bounds,t),this.fire("cellenter",{bounds:i.bounds,coords:t}),this._activeCells[e]=i),i||(i={coords:t,bounds:this._cellCoordsToBounds(t)},this._cells[e]=i,this._activeCells[e]=i,this.createCell&&this.createCell(i.bounds,t),this.fire("cellcreate",{bounds:i.bounds,coords:t}))},_wrapCoords:function(t){t.x=this._wrapLng?e.Util.wrapNum(t.x,this._wrapLng):t.x,t.y=this._wrapLat?e.Util.wrapNum(t.y,this._wrapLat):t.y},_getCellNumBounds:function(){var t=this._map.getPixelWorldBounds(),i=this._getCellSize();return t?e.bounds(t.min.divideBy(i).floor(),t.max.divideBy(i).ceil().subtract([1,1])):null}});function mt(t){this.values=[].concat(t||[])}mt.prototype.query=function(t){var e=this.getIndex(t);return this.values[e]},mt.prototype.getIndex=function(t){this.dirty&&this.sort();for(var e,i,s=0,r=this.values.length-1;s<=r;)if(e=(s+r)/2|0,+(i=this.values[Math.round(e)]).value<+t)s=e+1;else{if(!(+i.value>+t))return e;r=e-1}return Math.abs(~r)},mt.prototype.between=function(t,e){var i=this.getIndex(t),s=this.getIndex(e);if(0===i&&0===s)return[];for(;this.values[i-1]&&this.values[i-1].value===t;)i--;for(;this.values[s+1]&&this.values[s+1].value===e;)s++;return this.values[s]&&this.values[s].value===e&&this.values[s+1]&&s++,this.values.slice(i,s)},mt.prototype.insert=function(t){return this.values.splice(this.getIndex(t.value),0,t),this},mt.prototype.bulkAdd=function(t,e){return this.values=this.values.concat([].concat(t||[])),e?this.sort():this.dirty=!0,this},mt.prototype.sort=function(){return this.values.sort(function(t,e){return+e.value-+t.value}).reverse(),this.dirty=!1,this};var ft=dt.extend({options:{attribution:null,where:"1=1",fields:["*"],from:!1,to:!1,timeField:!1,timeFilterMode:"server",simplifyFactor:0,precision:6},initialize:function(t){if(dt.prototype.initialize.call(this,t),t=U(t),t=e.Util.setOptions(this,t),this.service=nt(t),this.service.addEventParent(this),"*"!==this.options.fields[0]){for(var i=!1,s=0;s<this.options.fields.length;s++)this.options.fields[s].match(/^(OBJECTID|FID|OID|ID)$/i)&&(i=!0);!1===i&&M("no known esriFieldTypeOID field detected in fields Array.  Please add an attribute field containing unique IDs to ensure the layer can be drawn correctly.")}this.options.timeField.start&&this.options.timeField.end?(this._startTimeIndex=new mt,this._endTimeIndex=new mt):this.options.timeField&&(this._timeIndex=new mt),this._cache={},this._currentSnapshot=[],this._activeRequests=0},onAdd:function(t){return D(t),this.service.metadata(function(e,i){if(!e){var s=i.supportedQueryFormats,r=!1;!1===this.service.options.isModern&&(r=!0),!r&&s&&-1!==s.indexOf("geoJSON")&&(this.service.options.isModern=!0),!this.options.attribution&&t.attributionControl&&i.copyrightText&&(this.options.attribution=i.copyrightText,t.attributionControl.addAttribution(this.getAttribution()))}},this),t.on("zoomend",this._handleZoomChange,this),dt.prototype.onAdd.call(this,t)},onRemove:function(t){return t.off("zoomend",this._handleZoomChange,this),dt.prototype.onRemove.call(this,t)},getAttribution:function(){return this.options.attribution},createCell:function(t,e){this._visibleZoom()&&this._requestFeatures(t,e)},_requestFeatures:function(t,i,s){return this._activeRequests++,1===this._activeRequests&&this.fire("loading",{bounds:t},!0),this._buildQuery(t).run(function(r,n,o){o&&o.exceededTransferLimit&&this.fire("drawlimitexceeded"),!r&&n&&n.features.length&&e.Util.requestAnimFrame(e.Util.bind(function(){this._addFeatures(n.features,i),this._postProcessFeatures(t)},this)),r||!n||n.features.length||this._postProcessFeatures(t),r&&this._postProcessFeatures(t),s&&s.call(this,r,n)},this)},_postProcessFeatures:function(t){this._activeRequests--,this._activeRequests<=0&&this.fire("load",{bounds:t})},_cacheKey:function(t){return t.z+":"+t.x+":"+t.y},_addFeatures:function(t,e){var i=this._cacheKey(e);this._cache[i]=this._cache[i]||[];for(var s=t.length-1;s>=0;s--){var r=t[s].id;-1===this._currentSnapshot.indexOf(r)&&this._currentSnapshot.push(r),-1===this._cache[i].indexOf(r)&&this._cache[i].push(r)}this.options.timeField&&this._buildTimeIndexes(t),this.createLayers(t)},_buildQuery:function(t){var i=this.service.query().intersects(t).where(this.options.where).fields(this.options.fields).precision(this.options.precision);return this.options.requestParams&&e.Util.extend(i.params,this.options.requestParams),this.options.simplifyFactor&&i.simplify(this._map,this.options.simplifyFactor),"server"===this.options.timeFilterMode&&this.options.from&&this.options.to&&i.between(this.options.from,this.options.to),i},setWhere:function(t,i,s){this.options.where=t&&t.length?t:"1=1";for(var r=[],n=[],o=0,a=null,l=e.Util.bind(function(t,l){if(t&&(a=t),l)for(var u=l.features.length-1;u>=0;u--)n.push(l.features[u].id);--o<=0&&this._visibleZoom()&&(this._currentSnapshot=n,e.Util.requestAnimFrame(e.Util.bind(function(){this.removeLayers(r),this.addLayers(n),i&&i.call(s,a)},this)))},this),u=this._currentSnapshot.length-1;u>=0;u--)r.push(this._currentSnapshot[u]);for(var h in this._activeCells){o++;var c=this._keyToCellCoords(h),p=this._cellCoordsToBounds(c);this._requestFeatures(p,h,l)}return this},getWhere:function(){return this.options.where},getTimeRange:function(){return[this.options.from,this.options.to]},setTimeRange:function(t,i,s,r){var n=this.options.from,o=this.options.to,a=0,l=null,u=e.Util.bind(function(e){e&&(l=e),this._filterExistingFeatures(n,o,t,i),a--,s&&a<=0&&s.call(r,l)},this);if(this.options.from=t,this.options.to=i,this._filterExistingFeatures(n,o,t,i),"server"===this.options.timeFilterMode)for(var h in this._activeCells){a++;var c=this._keyToCellCoords(h),p=this._cellCoordsToBounds(c);this._requestFeatures(p,h,u)}return this},refresh:function(){for(var t in this._activeCells){var e=this._keyToCellCoords(t),i=this._cellCoordsToBounds(e);this._requestFeatures(i,t)}this.redraw&&this.once("load",function(){this.eachFeature(function(t){this._redraw(t.feature.id)},this)},this)},_filterExistingFeatures:function(t,i,s,r){var n=t&&i?this._getFeaturesInTimeRange(t,i):this._currentSnapshot,o=this._getFeaturesInTimeRange(s,r);if(o.indexOf)for(var a=0;a<o.length;a++){var l=n.indexOf(o[a]);l>=0&&n.splice(l,1)}e.Util.requestAnimFrame(e.Util.bind(function(){this.removeLayers(n),this.addLayers(o)},this))},_getFeaturesInTimeRange:function(t,e){var i,s=[];if(this.options.timeField.start&&this.options.timeField.end){var r=this._startTimeIndex.between(t,e),n=this._endTimeIndex.between(t,e);i=r.concat(n)}else i=this._timeIndex.between(t,e);for(var o=i.length-1;o>=0;o--)s.push(i[o].id);return s},_buildTimeIndexes:function(t){var e,i;if(this.options.timeField.start&&this.options.timeField.end){var s=[],r=[];for(e=t.length-1;e>=0;e--)i=t[e],s.push({id:i.id,value:new Date(i.properties[this.options.timeField.start])}),r.push({id:i.id,value:new Date(i.properties[this.options.timeField.end])});this._startTimeIndex.bulkAdd(s),this._endTimeIndex.bulkAdd(r)}else{var n=[];for(e=t.length-1;e>=0;e--)i=t[e],n.push({id:i.id,value:new Date(i.properties[this.options.timeField])});this._timeIndex.bulkAdd(n)}},_featureWithinTimeRange:function(t){if(!this.options.from||!this.options.to)return!0;var e=+this.options.from.valueOf(),i=+this.options.to.valueOf();if("string"==typeof this.options.timeField){var s=+t.properties[this.options.timeField];return s>=e&&s<=i}if(this.options.timeField.start&&this.options.timeField.end){var r=+t.properties[this.options.timeField.start],n=+t.properties[this.options.timeField.end];return r>=e&&r<=i||n>=e&&n<=i}},_visibleZoom:function(){if(!this._map)return!1;var t=this._map.getZoom();return!(t>this.options.maxZoom||t<this.options.minZoom)},_handleZoomChange:function(){if(this._visibleZoom())for(var t in this._activeCells){var e=this._activeCells[t].coords,i=this._cacheKey(e);this._cache[i]&&this.addLayers(this._cache[i])}else this.removeLayers(this._currentSnapshot),this._currentSnapshot=[]},authenticate:function(t){return this.service.authenticate(t),this},metadata:function(t,e){return this.service.metadata(t,e),this},query:function(){return this.service.query()},_getMetadata:function(t){this._metadata?t(void 0,this._metadata):this.metadata(e.Util.bind(function(e,i){this._metadata=i,t(e,this._metadata)},this))},addFeature:function(t,i,s){this._getMetadata(e.Util.bind(function(r,n){r?i&&i.call(this,r,null):this.service.addFeature(t,e.Util.bind(function(e,r){e||(t.properties[n.objectIdField]=r.objectId,t.id=r.objectId,this.createLayers([t])),i&&i.call(s,e,r)},this))},this))},updateFeature:function(t,e,i){this.service.updateFeature(t,function(s,r){s||(this.removeLayers([t.id],!0),this.createLayers([t])),e&&e.call(i,s,r)},this)},deleteFeature:function(t,e,i){this.service.deleteFeature(t,function(t,s){!t&&s.objectId&&this.removeLayers([s.objectId],!0),e&&e.call(i,t,s)},this)},deleteFeatures:function(t,e,i){return this.service.deleteFeatures(t,function(t,s){if(!t&&s.length>0)for(var r=0;r<s.length;r++)this.removeLayers([s[r].objectId],!0);e&&e.call(i,t,s)},this)}}),yt=ft.extend({options:{cacheLayers:!0},initialize:function(t){ft.prototype.initialize.call(this,t),this._originalStyle=this.options.style,this._layers={}},onRemove:function(t){for(var e in this._layers)t.removeLayer(this._layers[e]),this.fire("removefeature",{feature:this._layers[e].feature,permanent:!1},!0);return ft.prototype.onRemove.call(this,t)},createNewLayer:function(t){var i=e.GeoJSON.geometryToLayer(t,this.options);return i.defaultOptions=i.options,i},_updateLayer:function(t,i){var s=[],r=this.options.coordsToLatLng||e.GeoJSON.coordsToLatLng;switch(i.properties&&(t.feature.properties=i.properties),i.geometry.type){case"Point":s=e.GeoJSON.coordsToLatLng(i.geometry.coordinates),t.setLatLng(s);break;case"LineString":s=e.GeoJSON.coordsToLatLngs(i.geometry.coordinates,0,r),t.setLatLngs(s);break;case"MultiLineString":case"Polygon":s=e.GeoJSON.coordsToLatLngs(i.geometry.coordinates,1,r),t.setLatLngs(s);break;case"MultiPolygon":s=e.GeoJSON.coordsToLatLngs(i.geometry.coordinates,2,r),t.setLatLngs(s)}},createLayers:function(t){for(var e=t.length-1;e>=0;e--){var i,s=t[e],r=this._layers[s.id];this._visibleZoom()&&r&&!this._map.hasLayer(r)&&(this._map.addLayer(r),this.fire("addfeature",{feature:r.feature},!0)),r&&this.options.simplifyFactor>0&&(r.setLatLngs||r.setLatLng)&&this._updateLayer(r,s),r||((i=this.createNewLayer(s)).feature=s,i.addEventParent(this),this.options.onEachFeature&&this.options.onEachFeature(i.feature,i),this._layers[i.feature.id]=i,this.setFeatureStyle(i.feature.id,this.options.style),this.fire("createfeature",{feature:i.feature},!0),this._visibleZoom()&&(!this.options.timeField||this.options.timeField&&this._featureWithinTimeRange(s))&&this._map.addLayer(i))}},addLayers:function(t){for(var e=t.length-1;e>=0;e--){var i=this._layers[t[e]];i&&this._map.addLayer(i)}},removeLayers:function(t,e){for(var i=t.length-1;i>=0;i--){var s=t[i],r=this._layers[s];r&&(this.fire("removefeature",{feature:r.feature,permanent:e},!0),this._map.removeLayer(r)),r&&e&&delete this._layers[s]}},cellEnter:function(t,i){this._visibleZoom()&&!this._zooming&&this._map&&e.Util.requestAnimFrame(e.Util.bind(function(){var t=this._cacheKey(i),e=this._cellCoordsToKey(i),s=this._cache[t];this._activeCells[e]&&s&&this.addLayers(s)},this))},cellLeave:function(t,i){this._zooming||e.Util.requestAnimFrame(e.Util.bind(function(){if(this._map){var t=this._cacheKey(i),e=this._cellCoordsToKey(i),s=this._cache[t],r=this._map.getBounds();if(!this._activeCells[e]&&s){for(var n=!0,o=0;o<s.length;o++){var a=this._layers[s[o]];a&&a.getBounds&&r.intersects(a.getBounds())&&(n=!1)}n&&this.removeLayers(s,!this.options.cacheLayers),!this.options.cacheLayers&&n&&(delete this._cache[t],delete this._cells[e],delete this._activeCells[e])}}},this))},resetStyle:function(){return this.options.style=this._originalStyle,this.eachFeature(function(t){this.resetFeatureStyle(t.feature.id)},this),this},setStyle:function(t){return this.options.style=t,this.eachFeature(function(e){this.setFeatureStyle(e.feature.id,t)},this),this},resetFeatureStyle:function(t){var i=this._layers[t],s=this._originalStyle||e.Path.prototype.options;return i&&(e.Util.extend(i.options,i.defaultOptions),this.setFeatureStyle(t,s)),this},setFeatureStyle:function(t,e){var i=this._layers[t];return"function"==typeof e&&(e=e(i.feature)),i.setStyle&&i.setStyle(e),this},eachActiveFeature:function(t,e){if(this._map){var i=this._map.getBounds();for(var s in this._layers)-1!==this._currentSnapshot.indexOf(this._layers[s].feature.id)&&("function"==typeof this._layers[s].getLatLng&&i.contains(this._layers[s].getLatLng())?t.call(e,this._layers[s]):"function"==typeof this._layers[s].getBounds&&i.intersects(this._layers[s].getBounds())&&t.call(e,this._layers[s]))}return this},eachFeature:function(t,e){for(var i in this._layers)t.call(e,this._layers[i]);return this},getFeature:function(t){return this._layers[t]},bringToBack:function(){this.eachFeature(function(t){t.bringToBack&&t.bringToBack()})},bringToFront:function(){this.eachFeature(function(t){t.bringToFront&&t.bringToFront()})},redraw:function(t){return t&&this._redraw(t),this},_redraw:function(t){var i=this._layers[t],s=i.feature;if(i&&i.setIcon&&this.options.pointToLayer&&this.options.pointToLayer){var r=this.options.pointToLayer(s,e.latLng(s.geometry.coordinates[1],s.geometry.coordinates[0])).options.icon;i.setIcon(r)}if(i&&i.setStyle&&this.options.pointToLayer){var n=this.options.pointToLayer(s,e.latLng(s.geometry.coordinates[1],s.geometry.coordinates[0])).options;this.setFeatureStyle(s.id,n)}i&&i.setStyle&&this.options.style&&this.resetStyle(s.id)}});t.VERSION="2.1.4",t.Support=r,t.options=n,t.Util=N,t.get=d,t.post=u,t.request=c,t.Task=j,t.task=function(t){return t=U(t),new j(t)},t.Query=Z,t.query=J,t.Find=W,t.find=Q,t.Identify=V,t.identify=function(t){return new V(t)},t.IdentifyFeatures=H,t.identifyFeatures=K,t.IdentifyImage=X,t.identifyImage=$,t.Service=Y,t.service=function(t){return t=U(t),new Y(t)},t.MapService=tt,t.mapService=et,t.ImageService=it,t.imageService=st,t.FeatureLayerService=rt,t.featureLayerService=nt,t.BasemapLayer=at,t.basemapLayer=function(t,e){return new at(t,e)},t.TiledMapLayer=lt,t.tiledMapLayer=function(t,e){return new lt(t,e)},t.RasterLayer=ht,t.ImageMapLayer=ct,t.imageMapLayer=function(t,e){return new ct(t,e)},t.DynamicMapLayer=pt,t.dynamicMapLayer=function(t,e){return new pt(t,e)},t.FeatureManager=ft,t.FeatureLayer=yt,t.featureLayer=function(t){return new yt(t)},Object.defineProperty(t,"__esModule",{value:!0})});
//# sourceMappingURL=esri-leaflet.js.map

/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var mapsComplementC3061B8C85C14FAB9DEBD86048655900;
            (function (mapsComplementC3061B8C85C14FAB9DEBD86048655900) {
                "use strict";
                /*import DataViewObjectsParser = powerbi.extensibility.utils.dataview.DataViewObjectsParser;
            
                export class VisualSettings extends DataViewObjectsParser {
                  public dataPoint: dataPointSettings = new dataPointSettings();
                  }
            
                export class dataPointSettings {
                 // Default color
                  public defaultColor: string = "";
                 // Show all
                  public showAllDataPoints: boolean = true;
                 // Fill
                  public fill: string = "";
                 // Color saturation
                  public fillRule: string = "";
                 // Text Size
                  public fontSize: number = 12;
                 }*/
            })(mapsComplementC3061B8C85C14FAB9DEBD86048655900 = visual.mapsComplementC3061B8C85C14FAB9DEBD86048655900 || (visual.mapsComplementC3061B8C85C14FAB9DEBD86048655900 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var extensibility;
    (function (extensibility) {
        var visual;
        (function (visual) {
            var mapsComplementC3061B8C85C14FAB9DEBD86048655900;
            (function (mapsComplementC3061B8C85C14FAB9DEBD86048655900) {
                var Visual = (function () {
                    function Visual(options) {
                        console.log('Visual constructor', options);
                        this.target = options.element;
                        this.divMap = document.createElement("div");
                        this.divMap.id = "map";
                        this.divMap.style.height = "100%";
                        this.divMap.style.width = "100%";
                        this.divMap.style.position = "absolute";
                        this.divMap.style.top = "0";
                        this.divMap.style.bottom = "0";
                        this.divMap.style.right = "0";
                        this.divMap.style.left = "0";
                        options.element.appendChild(this.divMap);
                        var L = typeof L !== 'undefined' ? L : window['L'];
                        //No WMS or MapServer Map
                        // this.map = L.map('map');
                        // this.map.setView([-41.28,174.77], 11); 
                        // var mapLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>';
                        // this.layer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; ' + mapLink + ' Contributors', maxZoom: 18, });
                        // this.map.addLayer(this.layer);
                        //Alternative 1
                        this.basemap = L.esri.basemapLayer('Streets');
                        this.map.addLayer(this.basemap);
                        this.layer = L.esri.featureLayer({
                            url: 'https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0'
                        });
                        this.map.addLayer(this.layer);
                        //Alternative 2
                        // L.esri.basemapLayer('Streets').addTo(this.map);
                        // L.esri.featureLayer({
                        //     url:'https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0'
                        // }).addTo(this.map);
                    }
                    Visual.prototype.update = function (options) {
                        //update map size
                        this.divMap.style.height = options.viewport.height.toString() + "px";
                        this.divMap.style.width = options.viewport.width.toString() + "px";
                        var svg = d3.select("#map").select("svg"), g = svg.append("g");
                        var data = [
                            { lat: -41.28, lng: 174.77, latlng: {}, status: ['Under', 'Over', 'Normal'], itemCnt: [30, 40, 50] },
                            { lat: -41.29, lng: 174.76, latlng: {}, status: ['Under', 'Over', 'Normal'], itemCnt: [30, 30, 60] },
                            { lat: -41.23, lng: 174.79, latlng: {}, status: ['Under', 'Over', 'Normal'], itemCnt: [30, 70, 10] }
                        ];
                        data.forEach(function (d) {
                            d.latlng = new L.LatLng(d.lat, d.lng);
                        });
                        var circle = g.selectAll("circle")
                            .data(data)
                            .enter().append("circle")
                            .style("stroke", "black")
                            .style("opacity", .6)
                            .style("fill", "red")
                            .attr("r", 20);
                        this.map.on("viewreset", update);
                        update();
                        function update() {
                            circle.attr("transform", function (d) {
                                return "translate(" +
                                    this.map.latLngToLayerPoint(new L.LatLng(d.lat, d.lng)).x + "," +
                                    this.map.latLngToLayerPoint(new L.LatLng(d.lat, d.lng)).y + ")";
                            });
                        }
                    };
                    return Visual;
                }());
                mapsComplementC3061B8C85C14FAB9DEBD86048655900.Visual = Visual;
            })(mapsComplementC3061B8C85C14FAB9DEBD86048655900 = visual.mapsComplementC3061B8C85C14FAB9DEBD86048655900 || (visual.mapsComplementC3061B8C85C14FAB9DEBD86048655900 = {}));
        })(visual = extensibility.visual || (extensibility.visual = {}));
    })(extensibility = powerbi.extensibility || (powerbi.extensibility = {}));
})(powerbi || (powerbi = {}));
var powerbi;
(function (powerbi) {
    var visuals;
    (function (visuals) {
        var plugins;
        (function (plugins) {
            plugins.mapsComplementC3061B8C85C14FAB9DEBD86048655900 = {
                name: 'mapsComplementC3061B8C85C14FAB9DEBD86048655900',
                displayName: 'MapsComplement',
                class: 'Visual',
                version: '1.0.0',
                apiVersion: '1.10.0',
                create: function (options) { return new powerbi.extensibility.visual.mapsComplementC3061B8C85C14FAB9DEBD86048655900.Visual(options); },
                custom: true
            };
        })(plugins = visuals.plugins || (visuals.plugins = {}));
    })(visuals = powerbi.visuals || (powerbi.visuals = {}));
})(powerbi || (powerbi = {}));
//# sourceMappingURL=visual.js.map