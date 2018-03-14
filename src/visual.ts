module powerbi.extensibility.visual {
    
    export interface Data{
        lat: number;
        lng: number;
        latlng: {};
        status: string[];
        itemCnt: number[];
    }

    export class Visual implements IVisual {
        private target: HTMLElement;
        private divMap: HTMLElement;
        private divTable: HTMLElement;
        private map: L.Map;
        private basemap: L.TileLayer;
        private layer: L.TileLayer;

        constructor(options: VisualConstructorOptions) {
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
                    url:'https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0'
                });
                    this.map.addLayer(this.layer);
            
            //Alternative 2
                // L.esri.basemapLayer('Streets').addTo(this.map);
                // L.esri.featureLayer({
                //     url:'https://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/Heritage_Trees_Portland/FeatureServer/0'
                // }).addTo(this.map);
        }

        public update(options: VisualUpdateOptions) {
            //update map size
            this.divMap.style.height = options.viewport.height.toString() + "px";
            this.divMap.style.width = options.viewport.width.toString() + "px";
            
            var svg = d3.select("#map").select("svg"),
            g = svg.append("g");
            
            var data: Data[] = [ 
                {lat:-41.28, lng:174.77, latlng:{}, status:['Under','Over','Normal'], itemCnt: [30,40,50]},
                {lat:-41.29, lng:174.76, latlng:{}, status:['Under','Over','Normal'], itemCnt: [30,30,60]},
                {lat:-41.23, lng:174.79, latlng:{}, status:['Under','Over','Normal'], itemCnt: [30,70,10]} 
            ];

            data.forEach(function(d) {
                d.latlng = new L.LatLng(<number>d.lat, <number>d.lng);
            })
            
            var circle= g.selectAll("circle")
                .data(data)
                .enter().append("circle")
                .style("stroke", "black")  
                .style("opacity", .6) 
                .style("fill", "red")
                .attr("r", 20)
                
            this.map.on("viewreset", update);
            update();

            function update() {
                circle.attr("transform", 
                function(d)  { 
                        return "translate("+ 
                        this.map.latLngToLayerPoint(new L.LatLng(d.lat, d.lng)).x +","+ 
                        this.map.latLngToLayerPoint(new L.LatLng(d.lat, d.lng)).y +")";
                        }
                )
            }
        }
    }
}