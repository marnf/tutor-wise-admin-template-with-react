import React, { Component } from "react";
import Chart from "react-apexcharts";

class RadialBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        plotOptions: {
          radialBar: {
            startAngle: 0,
            endAngle: 360,
            track: {
              background: "#f2f2f2",
              strokeWidth: "97%"
            },
            dataLabels: {
              show: true,
              value: {
                show: true,
                fontSize: "15px",
                offsetY: -1
              },
              total: {
                show: true,
                label: " ",
                color: "#373d3f"
              }
            }
          }
        }
      },
      series: [0]
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.percentage !== this.props.percentage) {
      this.setState({
        series: [this.props.percentage]
      });
    }
  }

  render() {
    return (
      <div className="donut">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
          width={this.props.size || "150"} // ডিফল্ট 150px
        />
      </div>
    );
  }
}

export default RadialBar;
