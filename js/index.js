function formatNumber(num) {
    const units = ['', '万', '亿']; // 单位数组
    const digit = Math.floor(Math.log10(num)); // 获取位数
    if (digit < 4) { // 最高位小于万不进行单位换算
        return `${num}`;
    }
    const prefix = Math.ceil(digit / 4); // 找到长度所在区间
    const result = Math.floor(num / Math.pow(10, (prefix - 1) * 4)); // 取最高位数字
    return `${result}${units[prefix - 1]}`;
}
/****/
$(document).ready(function () {
    var whei = $(window).width()
    $("html").css({ fontSize: whei / 20 })
    $(window).resize(function () {
        var whei = $(window).width()
        $("html").css({ fontSize: whei / 20 })
    });
});

$(window).load(function () { $(".loading").fadeOut() })
$(function () {
    let total = 0;
    let growth_rate_21 = 0;
    let growth_rate_22 = 0;
    let classTen = [];
    let names = [];
    let val1 = [];
    let val2 = [];
    let growth21 = [];
    let growth22 = [];
    $.getJSON("../data/1.json",
        (data) => {
            console.log("data", data);
            let total21 = data[0].data[0].value.currentYear
            let total22 = data[1].data[0].value.currentYear
            total = total21 + total22;
            $("#total").text(total);
            growth_rate_21 = Number(data[0].data[0].value.growth.toFixed(0))
            growth_rate_22 = Number(data[1].data[0].value.growth.toFixed(0))
            for (let index = 1; index < 11; index++) {
                let name = data[0].data[index].name;
                names.push(name.substring(0, 2))
                let value = data[0].data[index].value.currentYear + data[1].data[index].value.currentYear;
                val1.push(data[0].data[index].value.currentYear)
                val2.push(data[1].data[index].value.currentYear)
                let growth = (data[0].data[index].value.growth + data[1].data[index].value.growth).toFixed(0);
                classTen.push({ name, value, growth })
                growth21.push(data[0].data[index].value.growth)
                growth22.push(data[1].data[index].value.growth)
            }
            classTen.sort((a, b) => b.value - a.value);
            let html = ``;
            let html1 = ``;
            let decline = classTen.length;
            for (let index = 0; index < classTen.length; index++) {
                html += `<li>
                                <span>${index + 1}</span>
                                <div class="pmnav">
                                <p>${classTen[index].name}</p>
                                <div class="pmbar">
                                    <span style="width:${(decline) * 8}%"></span><i>${classTen[index].value}</i>
                                </div>
                                </div>
                            </li>`;
                html1 += `<li>
                            <div>
                            <p><img src="images/r${index}.png" />${classTen[index].name}</p>
                            <div class="barnav">
                                <div class="bar2"><span style="width: ${Math.floor(Math.random() * 71 + 10)}%"></span></div>
                                <span>${classTen[index].value}</span>
                            </div>
                            </div>
                            <div>
                            <div class="zaf">
                                <p>同比</p>
                                <p>
                                <span>${classTen[index].growth}<i>%</i></span
                                ><img src="images/${classTen[index].growth > 0 ? "up" : "down"}.png" />
                                </p>
                            </div>
                            </div>
                        </li>`;
                decline--;
            }
            console.log(classTen);
            $(".paim .rank").html($(html));
            $(".boxall .sec").html($(html1));
            let card1 = ``;
            for (let index = 0; index < 3; index++) {
                card1 += `<li class="col-4">
                            <div class="bar1">
                            <img src="images/r${index}.png" />
                            <h3><span>${classTen[index].name.substring(0, 2)}</span>${formatNumber(classTen[index].value)}</h3>
                            </div>
                        </li>`
            }
            $(".mainbox .cardlist1").html($(card1))
            let card2 = ``;
            for (let index = 3; index < 6; index++) {
                card2 += `<li class="col-4">
                            <div class="bar1 bar2">
                            <img src="images/r${index}.png" />
                            <h3><span>${classTen[index].name.substring(0, 3)}</span>${formatNumber(classTen[index].value)}</h3>
                            </div>
                        </li>`
            }
            $(".mainbox .cardlist2").html($(card2))
            // echarts_1()
            echarts_2()
            echarts_3()
            pe04()
            pe01()
            pe02()
            pe03()
        }
    );
    let countryData = []
    $.getJSON("../data/country.json", (data) => {
        countryData = data
        console.log("c", data);
        echarts_1()
    })
    function echarts_1() {
        var myChart = echarts.init(document.getElementById('echarts1'));
        option = {
            title: {
                text: '主\n要\n出\n口\n国', // 主标题文本，支持使用 \n 换行
                top: 60, // 定位 值: 'top', 'middle', 'bottom' 也可以是具体的值或者百分比
                left: 'right', // 值: 'left', 'center', 'right' 同上
                textStyle: { // 文本样式
                    fontSize: 16,
                    color: '#fff'
                }
            },
            grid: {
                width: '100%',
                height: '100%',
                left: '0%',
                right: '0%',
                bottom: '0%',
                containLabel: true
            },
            // 提示框组件
            tooltip: {
                trigger: 'item', // 触发类型, 数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用
                // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式
                // 使用函数模板  传入的数据值 -> value: number | Array
                formatter: function (val) {
                    if (val.data == null) return;
                    return val.data.name + ': ' + val.data.value
                }
            },
            visualMap: {//颜色的设置  dataRange
                type: 'piecewise',
                x: 'left',
                y: 'center',
                pieces: [
                    { gte: 12000000, color: '#FF1A1A', label: ">1200w" },
                    { gte: 4000000, lt: 12000000, color: '#FF4040', label: "400w-1200w" },
                    { gte: 1000000, lt: 4000000, color: '#FF6666', label: "100w-400w" },
                    { gte: 60000, lt: 1000000, color: '#FF8C8C', label: "6w-100w" },
                    { gte: 2000, lt: 60000, color: '#FFB3B3', label: "2k-6w" },
                    { lt: 2000, color: '#FFD9D9', label: "<1k" },
                ],
                textStyle: {
                    color: 'white'
                }
            },
            series: [
                {
                    type: 'map', // 类型
                    // 系列名称，用于tooltip的显示，legend 的图例筛选 在 setOption 更新数据和配置项时用于指定对应的系列
                    name: '世界地图',
                    mapType: 'world', // 地图类型
                    // 是否开启鼠标缩放和平移漫游 默认不开启 如果只想要开启缩放或者平移，可以设置成 'scale' 或者 'move' 设置成 true 为都开启
                    roam: true,
                    // 图形上的文本标签
                    label: {
                        show: false // 是否显示对应地名
                    },
                    zoom: 1.2,
                    // 地图区域的多边形 图形样式
                    itemStyle: {
                        // areaColor: '#7B68EE', // 地图区域的颜色 如果设置了visualMap，areaColor属性将不起作用
                        borderWidth: 0.5, // 描边线宽 为 0 时无描边
                        borderColor: '#000', // 图形的描边颜色 支持的颜色格式同 color，不支持回调函数
                        borderType: 'solid' // 描边类型，默认为实线，支持 'solid', 'dashed', 'dotted'
                    },
                    // 高亮状态下的多边形和标签样式
                    emphasis: {
                        label: {
                            show: true, // 是否显示标签
                            color: '#fff' // 文字的颜色 如果设置为 'auto'，则为视觉映射得到的颜色，如系列色
                        },
                        itemStyle: {
                            areaColor: '#FF6347' // 地图区域的颜色
                        }
                    },
                    // 自定义地区的名称映射
                    nameMap: name,
                    // 地图系列中的数据内容数组 数组项可以为单个数值
                    data: countryData
                }
            ]
        }

        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echarts2'));
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    lineStyle: {
                        color: '#dddc6b'
                    }
                }
            },

            grid: {
                left: '0',
                top: '30',
                right: '20',
                bottom: '-10',
                containLabel: true
            }, legend: {
                data: ['21年', '22年'],
                right: 'center',
                top: 0,
                textStyle: {
                    color: "#fff"
                },
                itemWidth: 12,
                itemHeight: 10,
                // itemGap: 35

            },
            xAxis: [{
                type: 'category',
                boundaryGap: false,
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 14,
                    },
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }

                },
                data: names
            }, {
                axisPointer: { show: false },
                axisLine: { show: false },
                position: 'bottom',
                offset: 20,
            }],
            yAxis: [{
                type: 'value',
                axisTick: { show: false },
                // splitNumber: 6,
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: "rgba(255,255,255,.6)",
                        fontSize: 14,
                    },
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.1)'
                    }
                }
            }],
            series: [
                {
                    name: '21年',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'rgba(228, 228, 126, 1)',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(228, 228, 126, .8)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(228, 228, 126, 0.1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#dddc6b',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: growth21
                }, {
                    name: '22年',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    showSymbol: false,
                    lineStyle: {
                        normal: {
                            color: 'rgba(255, 128, 128, 1)',
                            width: 2
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(255, 128, 128,.8)'
                            }, {
                                offset: 0.8,
                                color: 'rgba(255, 128, 128, .1)'
                            }], false),
                            shadowColor: 'rgba(0, 0, 0, 0.1)',
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#dddc6b',
                            borderColor: 'rgba(221, 220, 107, .1)',
                            borderWidth: 12
                        }
                    },
                    data: growth22

                },

            ]

        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function echarts_3() {
        // 基于准备好的dom，初始化echarts实例
        let classNames = classTen.map(item => item.name)
        let half = Math.ceil(classNames.length / 2);
        let firstHalf = classNames.splice(0, half);
        let secondHalf = classNames.splice(-half);
        var myChart = echarts.init(document.getElementById('echarts3'));
        option = {
            tooltip: {
                trigger: 'item'
            },
            legend: [{
                data: firstHalf,
                orient: 'vertical',
                textStyle: {
                    color: "#fff"
                },
                itemGap: 30,
                x: "0%",
                y: "10%",
                formatter: function (name) {
                    if (name.length > 3) {
                        return name.substring(0, 3) + '...';
                    } else {
                        return name;
                    }
                },
            }, {
                data: secondHalf,
                orient: 'vertical',
                textStyle: {
                    color: "#fff"
                },
                itemGap: 20,
                x: "80%",
                y: "10%",
                formatter: function (name) {
                    if (name.length > 3) {
                        return name.substring(0, 3) + '...';
                    } else {
                        return name;
                    }
                },
            }],

            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: classTen
                }
            ]
        }

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function pe01() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('pe01'));
        var txt = growth_rate_21
        option = {
            title: {
                text: txt + '%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#fff',
                    fontSize: '18'
                }
            },
            color: '#49bcf7',
            series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: true,
                radius: ['65%', '80%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false,
                data: [{
                    value: txt,
                    name: '已使用',
                    itemStyle: {
                        normal: {
                            color: '#eaff00',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    name: '未使用',
                    value: 100 - txt
                }]
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

    function pe02() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('pe02'));
        var txt = growth_rate_22
        option = {
            title: {
                text: txt + '%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#fff',
                    fontSize: '18'
                }
            },
            color: '#49bcf7',
            series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: true,
                radius: ['65%', '80%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false,
                data: [{
                    value: txt,
                    name: '已使用',
                    itemStyle: {
                        normal: {
                            color: '#ea4d4d',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    name: '未使用',
                    value: 100 - txt
                }]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function pe03() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('pe03'));
        var txt = ((growth_rate_21 + growth_rate_22) / 2).toFixed(0)
        option = {
            title: {
                text: txt + '%',
                x: 'center',
                y: 'center',
                textStyle: {
                    fontWeight: 'normal',
                    color: '#fff',
                    fontSize: '18'
                }
            },
            color: '#49bcf7',
            series: [{
                name: 'Line 1',
                type: 'pie',
                clockWise: true,
                radius: ['65%', '80%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false,
                data: [{
                    value: txt,
                    name: '已使用',
                    itemStyle: {
                        normal: {
                            color: '#395ee6',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    name: '未使用',
                    value: 100 - txt
                }
                ]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    function pe04() {
        // 基于准备好的dom，初始化echarts实例
        let radarNames = [];
        names.forEach(element => {
            radarNames.push({ text: element, max: 43227810 })
        });
        var myChart = echarts.init(document.getElementById('lastecharts'));
        option = {

            tooltip: {
                trigger: 'axis'
            },
            radar: [{
                // indicator: [{
                //     text: '盈利能力',
                //     max: 100
                // }, {
                //     text: '发展水平',
                //     max: 100
                // }, {
                //     text: '融资能力',
                //     max: 100
                // }, {
                //     text: '技术能力',
                //     max: 100
                // }, {
                //     text: '企业规模',
                //     max: 100
                // }],
                indicator: radarNames,
                textStyle: {
                    color: 'red'
                },
                center: ['50%', '50%'],
                radius: '70%',
                startAngle: 90,
                splitNumber: 4,
                shape: 'circle',

                name: {
                    padding: -5,
                    formatter: '{value}',
                    textStyle: {
                        fontSize: 14,
                        color: 'rgba(255,255,255,.6)'
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: 'rgba(255,255,255,.05)'
                    }
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.05)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255,255,255,.05)'
                    }
                }
            },],
            series: [{
                name: '雷达图',
                type: 'radar',
                tooltip: {
                    trigger: 'item'
                },
                data: [{
                    name: '21年',
                    value: val1,
                    lineStyle: {
                        normal: {
                            color: '#03b48e',
                            width: 2,
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: '#03b48e',
                            opacity: .4
                        }
                    },
                    symbolSize: 0,
                }, {
                    name: '22年',
                    value: val2,
                    symbolSize: 0,
                    lineStyle: {
                        normal: {
                            color: '#3893e5',
                            width: 2,
                        }
                    },
                    areaStyle: {
                        normal: {
                            color: 'rgba(19, 173, 255, 0.5)'
                        }
                    }
                }]
            },]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
})




























