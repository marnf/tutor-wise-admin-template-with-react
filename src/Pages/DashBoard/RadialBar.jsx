import React, { Component } from "react";
import Chart from "react-apexcharts";

class RadialBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        plotOptions: {
          radialBar: {
            startAngle: 0, // Start angle from the top (upward)
            endAngle: 360, // End angle to complete the circle

            track: {
              background: "#f2f2f2",
              strokeWidth: "97%"
            },
            dataLabels: {
              show: true,
              
              value: {
                show: true,
                fontSize: "15px",
                offsetY:-1,
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
      series: [0] // initial value
    };
  }

  // componentDidUpdate will update the series when percentage prop changes
  componentDidUpdate(prevProps) {
    if (prevProps.percentage !== this.props.percentage) {
      this.setState({
        series: [this.props.percentage] // update series with new percentage
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
          width="150"
        />
      </div>
    );
  }
}

export default RadialBar;
