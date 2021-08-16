
var normalCode = "\"ui\";\n\nui.layout(\n    <frame>\n    </frame>\n);\n";

normalCode = '"ui";\n' +
    '\n' +
    'ui.layout(\n' +
    '    <drawer id="drawer">\n' +
    '        <vertical>\n' +
    '            <appbar>\n' +
    '                <toolbar id="toolbar" title="示例"/>\n' +
    '                <tabs id="tabs"/>\n' +
    '            </appbar>\n' +
    '            <viewpager id="viewpager">\n' +
    '                <frame>\n' +
    '                    <text text="第一页内容" textColor="black" textSize="16sp"/>\n' +
    '                </frame>\n' +
    '                <frame>\n' +
    '                    <text text="第二页内容" textColor="red" textSize="16sp"/>\n' +
    '                </frame>\n' +
    '            </viewpager>\n' +
    '        </vertical>\n' +
    '    </drawer>\n' +
    ');\n' +
    '\n' +
    '\n' +
    'var color = <text text="第三页"/>;\n' +
    '\n' +
    '//创建选项菜单(右上角)\n' +
    'ui.emitter.on("create_options_menu", menu => {\n' +
    '    menu.add("设置");\n' +
    '    menu.add("关于");\n' +
    '});\n' +
    '//监听选项菜单点击\n' +
    'ui.emitter.on("options_item_selected", (e, item) => {\n' +
    '    switch (item.getTitle()) {\n' +
    '        case "设置":\n' +
    '            toast("还没有设置");\n' +
    '            break;\n' +
    '        case "关于":\n' +
    '            alert("关于", "Auto.js界面模板 v1.0.0");\n' +
    '            break;\n' +
    '    }\n' +
    '    e.consumed = true;\n' +
    '});\n' +
    'activity.setSupportActionBar(ui.toolbar);';

const iconsMap = {
    "normal":"integral",
    "frame":"viewgallery",
    "horizontal":"column-horizontal",
    "vertical":"column-vertical",
    "SurfaceView":"video",
    "input":"editor",
    "img":"pic",
    "text":"text",
    "form":"form",
    "grid":"form",
    "list":"nav-list",
    "checkbox":"confirm",
    "switch":"switch",
    "progressbar":"progress",
    "seekbar":"progress",
    "map":"map",
};

require.config({
    waitSeconds: 1000,
    paths : {
        "ace" : "ace/ace",
        "vue" : "js/plugins/vue.min",
        "esprima" : "js/plugins/esprima.min",
        "blockly" : "blockly/blockly_compressed"
    }
});

var targetPoint = null;
var target = null;
var Vue = null;

window.onload=function(){
    //初始化代码编辑器
    require(["ace"],function () {
        AceUtils.createEditor("editor");
        AceUtils.setCode(normalCode);
    });

    //初始化解析器
    require(["esprima"],function (esprima) {
        CodeUtils.init(esprima)
    });

    //边缘拖拽绑定
    ViewUtils.makeDrawer("new-space","left");
    ViewUtils.makeDrawer("tree-space","left");
    ViewUtils.makeDrawer("code-space","right");
    ViewUtils.makeDrawer("attr-space","right");
    ViewUtils.makeDrawer("preview-space","right");

    require(["vue"],function (VueIn) {
        Vue = VueIn;
        Vue.component("custom-select",{
            data:function(){
                return {
                    selectShow:false,
                    val:"",
                    choosed:null
                }
            },
            props:["btn","list"],
            template:`
            <div class="select-box">
                <div class="select-input">
                    <input type="text" id="select-target" class="tool-input" :value="val" @click="freshList();selectShow=!selectShow" placeholder="选择编辑目标"/>
                    <button class="tool-btn btn-2" @click="freshList()" title="切换编辑目标。">刷新</button>
                    <span></span>
                </div>
                <custom-list class="select-show" v-show="selectShow" :list="list" v-on:value1="selectValueHandle"></custom-list>
            </div>
        `,
            methods:{
                selectValueHandle: function(item){
                    this.selectShow = false;
                    this.chooseItem(item);
                },
                freshList: function () {
                    freshXmlList();
                },
                chooseItem: function (item) {
                    changeTarget(item);
                    this.choosed = item;
                    this.val = item.tip+" [line:"+item.line[0]+"~"+item.line[1]+"]";
                }
            }
        });
        Vue.component("custom-list",{
            props:["list"],
            template:`
            <ul class="select-list">
                <li class="select-item" v-for="item in list" @click="searchValueHandle(item)">{{item.tip+" [line:"+item.line[0]+"~"+item.line[1]+"]"}}</li>
            </ul>
        `,
            methods:{
                searchValueHandle(item){
                    this.$emit("value1",item)
                }
            }
        });
        Vue.component('dropdown', {
            template: '#dropdown',
            props: {
                type: String,
                options: String,
                disabled: Boolean,
                value: String
            },
            data: function () {
                return {
                    selected: {},
                    optionsShown: false,
                    maxItem: 20, //the max number of option that shown on the list
                    input_value: '',
                }
            },
            created: function () {
                this.input_value = this.value;
                if(this.options.length===0){
                    this.optionsArray = [];
                }else {
                    this.optionsArray = this.options.split("|");
                }
            },
            computed: {
                filteredOptions:function() {
                    const filtered = [];
                    const regOption = new RegExp(this.input_value, 'ig');
                    if(this.optionsArray.length===1&&this.optionsArray[0]==="null"){
                        return filtered;
                    }
                    for(var ii = 0; ii < this.optionsArray.length; ii++){
                        if (this.input_value.length < 1 || this.optionsArray[ii].match(regOption)) {
                            if (filtered.length < this.maxItem)
                                filtered.push(this.optionsArray[ii]);
                        }
                    }
                    return filtered;
                },
            },
            methods: {
                inputRule:function(type){
                    var value;
                    switch(type){
                        case 'text':
                            value = this.input_value.replace(/[^a-zA-Z0-9]/g,'');
                            break;
                        case 'number':
                            value = this.input_value.replace(/^(?![+-]?\d+(\.\d+)?$)/g,'');
                            break;
                        case 'percentage':
                            value = this.input_value.replace(/[^\d]/g,'');
                            value = value > 100 ? '100' : value;
                            value = value < 0 ? '0' : value;
                            break;
                        default:
                            console.log("no limitation");
                    }
                    return value;
                },
                selectOption: function (option) {
                    this.selected = option;
                    this.optionsShown = false;
                    this.input_value = this.selected;
                },
                showOptions: function () {
                    this.optionsShown = true;
                },
                exit: function () {
                    this.optionsShown = false;
                },
                // Selecting when pressing Enter
                keyMonitor: function (event) {
                    if (event.key === "Enter") {
                        if (this.filteredOptions[0])
                            this.selectOption(this.filteredOptions[0]);
                        else
                            this.selectOption(this.input_value);
                    }
                },
            },
            watch: {
                value:function() {
                    this.input_value = this.value;
                },
                input_value:function() {
                    if (this.filteredOptions.length === 0)
                        this.selected = this.input_value;
                    else
                        this.selected = this.filteredOptions[0];
                    this.$emit('on_change_input_value', this.input_value);
                }
            }
        });
        //初始化工具栏
        toolbar = new Vue({
            el: '#toolbar',
            data: {
                ip: '',
                path: '',
                list:[],
                val:'',
            },
            methods: {
                show: function (target) {
                    var id = target.id;
                    if (id === "show-new") {
                        ViewUtils.changeShowMode("new-space", target);
                    } else if (id === "show-code") {
                        ViewUtils.changeShowMode("code-space", target);
                    } else if (id === "show-tree") {
                        ViewUtils.changeShowMode("tree-space", target);
                    } else if (id === "show-preview") {
                        ViewUtils.changeShowMode("preview-space", target);
                    } else if (id === "show-attr") {
                        ViewUtils.changeShowMode("attr-space", target);
                    } else if (id === "show-structure") {
                        if (document.getElementById("structure-space").style.display === "none") {
                            document.getElementById("code-space").style.removeProperty("flex-grow")
                        } else {
                            document.getElementById("code-space").style.setProperty("flex-grow", "1")
                        }
                        ViewUtils.changeShowMode("structure-space", target);
                    }
                    if (document.getElementById("structure-space").style.display === "inline-block") {
                        DrawSpace.freshSize();
                    }
                },
                ast: function () {
                    if(CodeUtils.Esprima!=null){
                        console.log(JSON.stringify(CodeUtils.Esprima.parse(AceUtils.getCode(true),{jsx: true }),null,4));
                    }
                },
                astPosition: function () {
                    if(CodeUtils.Esprima!=null){
                        console.log(JSON.stringify(CodeUtils.Esprima.parse(AceUtils.getCode(true),{jsx: true ,loc: true, range: true}),null,4));
                    }
                },
                freshXmlList: function () {
                    console.log(JSON.stringify(CodeUtils.getXmlCodeList(AceUtils.getCode(true)),null,4));
                },
                getXmlCode: function () {
                    console.log(CodeUtils.getXmlCode(target,targetPoint.indent));
                },
                freshXmlAnalysis: function () {
                    freshAnalysis()
                }
            }
        });
    });


    //初次解析
    require(["esprima","ace","vue"],function () {
        freshXmlList();
        if(toolbar.list.length>0){
            toolbar.$refs.selectTarget.chooseItem(toolbar.list[0])
        }
    });

    //初始化分栏显示状态
    ViewUtils.changeShowBtnState("show-new",true);
    ViewUtils.changeShowBtnState("show-tree",true);
    ViewUtils.changeShowBtnState("show-code",true);
    ViewUtils.changeShowBtnState("show-attr",true);
    ViewUtils.changeShowBtnState("show-preview",false);
    ViewUtils.changeShowBtnState("show-structure",true);
    ViewUtils.changeViewState("preview-space",false);

    //初始化新增区
    initAdd();
};

function initAdd() {
    let parent = document.getElementById("new-show");
    let groups = document.getElementsByTagName("WidgetGroup");
    for (let i = 0; i < groups.length; i++) {
        let box = document.createElement("div");
        let titleBox = document.createElement("div");
        let title = document.createElement("div");
        let swi = document.createElement("i");
        let holder = document.createElement("div");
        box.className = "new-box";
        title.className = "new-title";
        titleBox.className = "new-title-box";
        swi.className = "new-swi iconfont icon-arrow-down";
        holder.className = "new-items-holder";
        parent.appendChild(box);
        box.appendChild(titleBox);
        titleBox.appendChild(swi);
        titleBox.appendChild(title);
        box.appendChild(holder);
        title.innerText = groups[i].getAttribute("name");
        titleBox.onmousedown = function(e){
            if(holder.style.height!=="0px"){
                holder.style.height = "0px";
                swi.className = "new-swi iconfont icon-arrow-right";
            }else {
                holder.style.height = "auto";
                swi.className = "new-swi iconfont icon-arrow-down";
            }
        };
        let widgets = groups[i].getElementsByTagName("Widget");
        for (let j = 0; j < widgets.length; j++) {
            let nameStr = widgets[j].getAttribute("name");
            let itemBox = document.createElement("div");
            let icon = document.createElement("i");
            let itemTitle = document.createElement("div");
            let itemExp = document.createElement("div");
            let itemMsg = document.createElement("div");
            itemBox.className = "new-item-box";
            if(iconsMap[nameStr]){
                icon.className = "iconfont icon-"+iconsMap[nameStr]+" new-item-icon";
            }else {
                icon.className = "iconfont icon-"+iconsMap["normal"]+" new-item-icon";
            }
            itemTitle.className = "new-item-title";
            itemExp.className = "new-item-exp";
            itemMsg.className = "new-item-msg";
            itemTitle.innerText = nameStr;
            itemExp.innerText = widgets[j].getAttribute("example");
            itemMsg.innerText = widgets[j].getAttribute("summary");
            holder.appendChild(itemBox);
            itemBox.appendChild(icon);
            itemBox.appendChild(itemTitle);
            itemBox.appendChild(itemExp);
            itemBox.appendChild(itemMsg);
        }
    }
}

function freshAttr(node) {
    let attrs = getAllNormalAttrs();
    for (let i = 0; i < node.attributes.length; i++) {
        let item = node.attributes.item(i);
        attrs[0].push(newAttr(item.name,item.value));
    }
    attrs[1] = getSpecialAttrs(node.tagName);
    for (let i = 1; i < attrs.length; i++) {
        for (let j = 0; j < attrs[i].length; j++) {
            for (let k = 0; k < attrs[0].length; k++) {
                if(attrs[0][k].name===attrs[i][j].name){
                    attrs[i][j] = attrs[0][k];
                }
            }
        }
    }
    let parent = document.getElementById("attr-show");
    let attrsTitles = ["当前属性","独有属性","常用属性","位置属性","全部属性"];
    for (let i = 1; i < attrs.length; i++) {
        if(attrs[i].length===0){
            continue;
        }
        let box = document.createElement("div");
        let titleBox = document.createElement("div");
        let title = document.createElement("div");
        let swi = document.createElement("i");
        let holder = document.createElement("div");
        box.className = "new-box";
        title.className = "new-title";
        titleBox.className = "new-title-box";
        swi.className = "new-swi iconfont icon-arrow-down";
        holder.className = "new-items-holder";
        parent.appendChild(box);
        box.appendChild(titleBox);
        titleBox.appendChild(swi);
        titleBox.appendChild(title);
        box.appendChild(holder);
        title.innerText = attrsTitles[i];
        titleBox.onmousedown = function(e){
            if(holder.style.height!=="0px"){
                holder.style.height = "0px";
                swi.className = "new-swi iconfont icon-arrow-right";
            }else {
                holder.style.height = "auto";
                swi.className = "new-swi iconfont icon-arrow-down";
            }
        };
        for (let j = 0; j < attrs[i].length; j++) {
            let line = document.createElement("div");
            line.className = "attr-line";
            let id = "dp-"+i+"-"+j;
            let item = attrs[i][j];

            line.innerHTML = "<div class='attr-name'>"+item.name+"</div>\n<dropdown value='' options='"+findOpt(item.name)+"' id='"+id+"' type='text' @on_change_input_value='onTextChange'></dropdown>"
            holder.appendChild(line);

            let dp = new Vue({
                el:"#"+id,
                methods:{
                    onTextChange:function (value) {
                        node.setAttribute(item.name,value);
                        item.value = value;
                    }
                }
            });
        }
    }
}

function freshStructure() {
    if(target!=null){
        let nodes = [];
        function addStructureView(node,parentView,level,inline) {
            let children = node.children;
            let nextInline = false;

            let box = document.createElement("div");
            let icon = document.createElement("i");
            let title = document.createElement("div");
            let msg = document.createElement("div");
            box.className = "structure-box";
            title.className = "structure-title";
            msg.className = "structure-msg";
            if(iconsMap[node.tagName]){
                icon.className = "iconfont icon-"+iconsMap[node.tagName]+" structure-icon";
            }else {
                icon.className = "iconfont icon-"+iconsMap["normal"]+" structure-icon";
            }
            if(inline){
                box.style.flexGrow=1;
            }
            parentView.appendChild(box);
            box.appendChild(icon);
            box.appendChild(title);
            box.appendChild(msg);
            title.innerText = node.tagName;
            title.nowrap = true;
            msg.nowrap = true;
            let attrs = node.attributes;
            let msgStr = "";
            for (let i = 0; i < attrs.length; i++) {
                let item = attrs.item(i);
                msgStr += item.name+" = "+item.value+"\n"
            }
            msgStr = msgStr.substring(0,msgStr.length-1);
            msg.innerText = msgStr;

            box.level = level;
            box.onmouseover = function(event){
                event.stopPropagation();
                if(!node.choosed){
                    box.style.background = "#e2e2e2"
                }
            };
            box.onmouseout = function(event){
                event.stopPropagation();
                if(!node.choosed){
                    box.resetBackground();
                }
            };
            box.resetBackground = function(){
                if(level%2===0){
                    box.style.background = "#f1f1f1"
                }else {
                    box.style.background = "#fefefe"
                }
            };
            box.resetBackground();
            node.choosed = false;
            box.onmousedown = function(event){
                event.stopPropagation();
                node.choosed = !node.choosed;
                let flag = node.choosed;
                clearNodesChoosed(nodes);
                if(flag){
                    chooseNode(node);
                }
            };
            node.structureBox = box;
            nodes.push(node);

            if(children.length>0){
                let split = document.createElement("div");
                let holder = document.createElement("div");
                split.className = "structure-split";
                holder.className = "structure-holder";
                if(node.tagName=="horizontal"){
                    nextInline = true;
                    holder.style.display="flex"
                }
                box.appendChild(split);
                box.appendChild(holder);

                for (let i = 0; i < children.length; i++) {
                    let midlle = document.createElement("div");
                    midlle.style.height = "0.1px";
                    holder.appendChild(midlle);
                    addStructureView(children[i],holder,level+1,nextInline);
                }
            }
        }
        var structurView = document.getElementById("structure-show");
        structurView.innerHTML = "";
        addStructureView(target.firstChild,structurView,0,false);
    }
}

function freshTree() {
    if(target!=null){
        let nodes = [];
        function addTreeView(node,parentView,level) {
            let children = node.children;

            let box = document.createElement("div");
            let swi = document.createElement("i");
            let icon = document.createElement("i");
            let title = document.createElement("div");
            box.className = "tree-box";
            title.className = "tree-title";
            if(iconsMap[node.tagName]){
                icon.className = "iconfont icon-"+iconsMap[node.tagName]+" tree-icon";
            }else {
                icon.className = "iconfont icon-"+iconsMap["normal"]+" tree-icon";
            }
            if(children.length>0){
                swi.className = "iconfont icon-arrow-down tree-swi";
                swi.style.marginLeft = level*16+4+"px";
                node.fold = false;
                swi.onmousedown = function (event) {
                    event.stopPropagation();
                    node.fold = !node.fold;
                    if(node.fold){
                        box.style.height = "26px";
                        swi.className = "iconfont icon-arrow-right tree-swi";
                    }else {
                        box.style.height = "";
                        swi.className = "iconfont icon-arrow-down tree-swi";
                    }
                };
            }else{
                swi.className = "";
                swi.style.marginLeft = level*16+24+"px";
            }
            box.style.background = "#fff";
            box.onmouseover = function(event){
                event.stopPropagation();
                if(!node.choosed){
                    box.style.background = "#e2e2e2"
                }
            };
            box.onmouseout = function(event){
                event.stopPropagation();
                if(!node.choosed){
                    box.resetBackground();
                }
            };
            box.resetBackground = function(){
                box.style.background = "#fff";
            };
            node.choosed = false;
            box.onmousedown = function(event){
                event.stopPropagation();
                node.choosed = !node.choosed;
                let flag = node.choosed;
                clearNodesChoosed(nodes);
                if(flag){
                    chooseNode(node);
                }
            };
            parentView.appendChild(box);
            box.appendChild(swi);
            box.appendChild(icon);
            box.appendChild(title);
            title.innerText = node.tagName;
            title.nowrap = true;
            node.treeBox = box;
            nodes.push(node);

            if(children.length>0){
                let holder = document.createElement("div");
                holder.className = "tree-holder";
                box.appendChild(holder);

                for (let i = 0; i < children.length; i++) {
                    let midlle = document.createElement("div");
                    midlle.style.height = "0.1px";
                    holder.appendChild(midlle);
                    addTreeView(children[i],holder,level+1);
                }
            }
        }
        var treeView = document.getElementById("tree-show");
        treeView.innerHTML = "";
        addTreeView(target.firstChild,treeView,0);
    }
}

function freshXmlList() {
    toolbar.list = CodeUtils.getXmlCodeList(AceUtils.getCode(true));
}

function changeTarget(t) {
    targetPoint = t;
    target = CodeUtils.updateXmlCode(AceUtils.getCode().substring(targetPoint.range[0],targetPoint.range[1]));
    freshAnalysis();
}

function freshAnalysis() {
    freshStructure();
    freshTree();
    freshAttr(target.firstChild);
}

function clearNodesChoosed(nodes) {
    for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.choosed = false;
        if(node.treeBox){
            node.treeBox.resetBackground();
        }
        if(node.structureBox){
            node.structureBox.resetBackground();
        }
    }
}
function chooseNode(node) {
    node.choosed = true;
    if(node.treeBox){
        node.treeBox.style.background = "#66ff6660";
    }
    if(node.structureBox){
        node.structureBox.style.background = "#66ff6660";
    }
}


function getAllNormalAttrs() {
    let arrayList = [];
    arrayList.push([]);
    arrayList.push([]);
    arrayList.push(getUsefulAttrs());
    arrayList.push(getPositionAttrs());
    arrayList.push(getAllAttrs());
    return arrayList;
}

function getPositionAttrs() {
    let attrs = [];
    attrs.push(newAttr("w"));
    attrs.push(newAttr("h"));
    attrs.push(newAttr("gravity"));
    attrs.push(newAttr("layout_gravity"));
    attrs.push(newAttr("layout_weight"));
    attrs.push(newAttr("margin"));
    attrs.push(newAttr("padding"));
    attrs.push(newAttr("minHeight"));
    attrs.push(newAttr("minWidth"));
    return attrs;
}
function getUsefulAttrs() {
    let attrs = [];
    attrs.push(newAttr("id"));
    attrs.push(newAttr("bg"));
    attrs.push(newAttr("style"));
    attrs.push(newAttr("alpha"));
    attrs.push(newAttr("foreground"));
    attrs.push(newAttr("visibility"));
    attrs.push(newAttr("rotation"));
    return attrs;
}
function getAllAttrs() {
    let attrs = [];
    attrs.push(newAttr("accessibilityLiveRegion"));
    attrs.push(newAttr("alpha"));
    attrs.push(newAttr("autoLink"));
    attrs.push(newAttr("autoSizeMaxTextSize"));
    attrs.push(newAttr("autoSizeMinTextSize"));
    attrs.push(newAttr("autoSizePresetSizes"));
    attrs.push(newAttr("autoSizeStepGranularity"));
    attrs.push(newAttr("autoSizeTextType"));
    attrs.push(newAttr("autoText"));
    attrs.push(newAttr("background"));
    attrs.push(newAttr("backgroundTint"));
    attrs.push(newAttr("backgroundTintMode"));
    attrs.push(newAttr("bufferType"));
    attrs.push(newAttr("capitalize"));
    attrs.push(newAttr("clickable"));
    attrs.push(newAttr("contentDescription"));
    attrs.push(newAttr("cursorVisible"));
    attrs.push(newAttr("digits"));
    attrs.push(newAttr("drawableBottom"));
    attrs.push(newAttr("drawableBottomCompat"));
    attrs.push(newAttr("drawableEnd"));
    attrs.push(newAttr("drawableEndCompat"));
    attrs.push(newAttr("drawableLeft"));
    attrs.push(newAttr("drawableLeftCompat"));
    attrs.push(newAttr("drawablePadding"));
    attrs.push(newAttr("drawableRight"));
    attrs.push(newAttr("drawableRightCompat"));
    attrs.push(newAttr("drawableStart"));
    attrs.push(newAttr("drawableStartCompat"));
    attrs.push(newAttr("drawableTint"));
    attrs.push(newAttr("drawableTintMode"));
    attrs.push(newAttr("drawableTop"));
    attrs.push(newAttr("drawableTopCompat"));
    attrs.push(newAttr("drawingCacheQuality"));
    attrs.push(newAttr("duplicateParentState"));
    attrs.push(newAttr("editable"));
    attrs.push(newAttr("editorExtras"));
    attrs.push(newAttr("elegantTextHeight"));
    attrs.push(newAttr("elevation"));
    attrs.push(newAttr("ellipsize"));
    attrs.push(newAttr("ems"));
    attrs.push(newAttr("enabled"));
    attrs.push(newAttr("fadeScrollbars"));
    attrs.push(newAttr("fadingEdge"));
    attrs.push(newAttr("fadingEdgeLength"));
    attrs.push(newAttr("filterTouchesWhenObscured"));
    attrs.push(newAttr("fitsSystemWindows"));
    attrs.push(newAttr("focusable"));
    attrs.push(newAttr("focusableInTouchMode"));
    attrs.push(newAttr("fontFamily"));
    attrs.push(newAttr("fontFeatureSettings"));
    attrs.push(newAttr("foreground"));
    attrs.push(newAttr("foregroundGravity"));
    attrs.push(newAttr("foregroundTint"));
    attrs.push(newAttr("foregroundTintMode"));
    attrs.push(newAttr("freezesText"));
    attrs.push(newAttr("gravity"));
    attrs.push(newAttr("hapticFeedbackEnabled"));
    attrs.push(newAttr("height"));
    attrs.push(newAttr("hint"));
    attrs.push(newAttr("id"));
    attrs.push(newAttr("imeActionId"));
    attrs.push(newAttr("imeActionLabel"));
    attrs.push(newAttr("imeOptions"));
    attrs.push(newAttr("importantForAccessibility"));
    attrs.push(newAttr("includeFontPadding"));
    attrs.push(newAttr("inputMethod"));
    attrs.push(newAttr("inputType"));
    attrs.push(newAttr("isScrollContainer"));
    attrs.push(newAttr("keepScreenOn"));
    attrs.push(newAttr("labelFor"));
    attrs.push(newAttr("layerType"));
    attrs.push(newAttr("layoutDirection"));
    attrs.push(newAttr("layout_gravity"));
    attrs.push(newAttr("layout_height"));
    attrs.push(newAttr("layout_margin"));
    attrs.push(newAttr("layout_weight"));
    attrs.push(newAttr("layout_width"));
    attrs.push(newAttr("letterSpacing"));
    attrs.push(newAttr("lineSpacingExtra"));
    attrs.push(newAttr("lineSpacingMultiplier"));
    attrs.push(newAttr("lines"));
    attrs.push(newAttr("linksClickable"));
    attrs.push(newAttr("longClickable"));
    attrs.push(newAttr("marqueeRepeatLimit"));
    attrs.push(newAttr("maxEms"));
    attrs.push(newAttr("maxHeight"));
    attrs.push(newAttr("maxLength"));
    attrs.push(newAttr("maxLines"));
    attrs.push(newAttr("maxWidth"));
    attrs.push(newAttr("minEms"));
    attrs.push(newAttr("minHeight"));
    attrs.push(newAttr("minLines"));
    attrs.push(newAttr("minWidth"));
    attrs.push(newAttr("nestedScrollingEnabled"));
    attrs.push(newAttr("nextFocusDown"));
    attrs.push(newAttr("nextFocusForward"));
    attrs.push(newAttr("nextFocusLeft"));
    attrs.push(newAttr("nextFocusRight"));
    attrs.push(newAttr("nextFocusUp"));
    attrs.push(newAttr("numeric"));
    attrs.push(newAttr("onClick"));
    attrs.push(newAttr("outlineProvider"));
    attrs.push(newAttr("overScrollMode"));
    attrs.push(newAttr("padding"));
    attrs.push(newAttr("password"));
    attrs.push(newAttr("phoneNumber"));
    attrs.push(newAttr("privateImeOptions"));
    attrs.push(newAttr("requiresFadingEdge"));
    attrs.push(newAttr("rotation"));
    attrs.push(newAttr("rotationX"));
    attrs.push(newAttr("rotationY"));
    attrs.push(newAttr("saveEnabled"));
    attrs.push(newAttr("scaleX"));
    attrs.push(newAttr("scaleY"));
    attrs.push(newAttr("scrollHorizontally"));
    attrs.push(newAttr("scrollX"));
    attrs.push(newAttr("scrollY"));
    attrs.push(newAttr("scrollbarAlwaysDrawHorizontalTrack"));
    attrs.push(newAttr("scrollbarAlwaysDrawVerticalTrack"));
    attrs.push(newAttr("scrollbarDefaultDelayBeforeFade"));
    attrs.push(newAttr("scrollbarFadeDuration"));
    attrs.push(newAttr("scrollbarSize"));
    attrs.push(newAttr("scrollbarStyle"));
    attrs.push(newAttr("scrollbarThumbHorizontal"));
    attrs.push(newAttr("scrollbarThumbVertical"));
    attrs.push(newAttr("scrollbarTrackHorizontal"));
    attrs.push(newAttr("scrollbarTrackVertical"));
    attrs.push(newAttr("scrollbars"));
    attrs.push(newAttr("selectAllOnFocus"));
    attrs.push(newAttr("shadowColor"));
    attrs.push(newAttr("shadowDx"));
    attrs.push(newAttr("shadowDy"));
    attrs.push(newAttr("shadowRadius"));
    attrs.push(newAttr("singleLine"));
    attrs.push(newAttr("soundEffectsEnabled"));
    attrs.push(newAttr("stateListAnimator"));
    attrs.push(newAttr("style"));
    attrs.push(newAttr("tag"));
    attrs.push(newAttr("targetApi"));
    attrs.push(newAttr("text"));
    attrs.push(newAttr("textAlignment"));
    attrs.push(newAttr("textAllCaps"));
    attrs.push(newAttr("textColor"));
    attrs.push(newAttr("textColorHighlight"));
    attrs.push(newAttr("textColorHint"));
    attrs.push(newAttr("textColorLink"));
    attrs.push(newAttr("textCursorDrawable"));
    attrs.push(newAttr("textDirection"));
    attrs.push(newAttr("textIsSelectable"));
    attrs.push(newAttr("textScaleX"));
    attrs.push(newAttr("textSize"));
    attrs.push(newAttr("textStyle"));
    attrs.push(newAttr("theme"));
    attrs.push(newAttr("transformPivotX"));
    attrs.push(newAttr("transformPivotY"));
    attrs.push(newAttr("transitionName"));
    attrs.push(newAttr("translationX"));
    attrs.push(newAttr("translationY"));
    attrs.push(newAttr("translationZ"));
    attrs.push(newAttr("verticalScrollbarPosition"));
    attrs.push(newAttr("visibility"));
    return attrs;
}

function getSpecialAttrs(name) {
    let attrs = [];
    if (name === "text") {
        attrs.push(newAttr("text"));
        attrs.push(newAttr("textSize"));
        attrs.push(newAttr("textColor"));
        attrs.push(newAttr("textStyle"));
        attrs.push(newAttr("lines"));
        attrs.push(newAttr("maxLines"));
        attrs.push(newAttr("typeface"));
        attrs.push(newAttr("ellipsize"));
        attrs.push(newAttr("ems"));
        attrs.push(newAttr("autoLink"));
    } else if (name === "input") {
        attrs.push(newAttr("text"));
        attrs.push(newAttr("textSize"));
        attrs.push(newAttr("textColor"));
        attrs.push(newAttr("hint"));
        attrs.push(newAttr("textColorHint"));
        attrs.push(newAttr("textSizeHint"));
        attrs.push(newAttr("inputType"));
        attrs.push(newAttr("password"));
        attrs.push(newAttr("numeric"));
        attrs.push(newAttr("phoneNumber"));
        attrs.push(newAttr("digits"));
        attrs.push(newAttr("singleLine"));
    } else if (name === "button") {
        attrs.push(newAttr("text"));
        attrs.push(newAttr("textSize"));
        attrs.push(newAttr("textColor"));
    } else if (name === "img") {
        attrs.push(newAttr("src"));
        attrs.push(newAttr("tint"));
        attrs.push(newAttr("scaleType"));
        attrs.push(newAttr("radius"));
        attrs.push(newAttr("radiusTopLeft"));
        attrs.push(newAttr("radiusTopRight"));
        attrs.push(newAttr("radiusBottomLeft"));
        attrs.push(newAttr("radiusBottomRight"));
        attrs.push(newAttr("borderWidth"));
        attrs.push(newAttr("borderColor"));
        attrs.push(newAttr("circle"));
    } else if (name === "vertical") {
        attrs.push(newAttr("layout_weight"));
    } else if (name === "horizontal") {
        attrs.push(newAttr("layout_weight"));
    } else if (name === "spinner") {
        attrs.push(newAttr("entries"));
        attrs.push(newAttr("spinnerMode"));
    } else if (name === "progressbar") {
        attrs.push(newAttr("progress"));
        attrs.push(newAttr("indeterminate"));
    }
    return attrs
}

function newAttr(name,value) {
    value = value || "";
    return {name:name,value:value}
}

function findOpt(name) {
    let opts = document.getElementsByTagName("Attr");
    for (let i = 0; i < opts.length; i++) {
        if(opts[i].getAttribute("name")===name){
            let res = "";
            let dos = opts[i].getElementsByTagName("opt");
            for (let j = 0; j < dos.length; j++) {
                if (j!=0){
                    res += "|";
                }
                res += dos[j].getAttribute("value");
            }
            return res;
        }
    }
    return "null";
}

