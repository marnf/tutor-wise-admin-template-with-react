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
              background: "#0d2849", // Deep Blue (ব্যাকগ্রাউন্ড রং)
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
                color: "#ffffff" // টোটাল লেবেল রং সাদা
              }
            }
          }
        },
        colors: ["#f0523a"], // Bright Orange Red (লোডিং রং)
      },
      series: [0] // ডিফল্ট সিরিজ ০%
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.percentage !== this.props.percentage) {
      this.setState({
        series: [this.props.percentage] // নতুন পার্সেন্টেজ সেট করা হচ্ছে
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
          width={this.props.size || "150"} // ডিফল্ট সাইজ 150px
        />
      </div>
    );
  }
}

export default RadialBar;
