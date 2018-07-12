import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ChartistGraph from 'react-chartist'
import './ProductAnalytics.css'
// import { getData } from '../../services/GoogleAnalytics'

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class ProductAnalytics extends Component {
    constructor(props) {
        super(props)

        const { user, product } = this.props
        if (!user || product === null) this.props.onBack()
        this.state = {
            id: product ? product.id : '',
            title: product ? product.name : '',
            totalRevenue: 3550.2,
            rangeRevenue: 140.2,
            currentTab: 0
        }
        this.props.navBarTitle(this.state.title)

        // getData().then(data => {
        //     console.log(data);
        // })
    }

    handleTabChange = (event, currentTab) => {
        this.setState({ currentTab });
    };

    render() {
        const { product } = this.props

        const lineChartData = {
            labels: [5, 9, 7, 8, 5, 3, 5, 4, 8, 5, 3, 5, 8, 5, 3, 5],
            series: [
                [5, 9, 7, 8, 5, 3, 5, 4, 8, 5, 3, 5, 8, 5, 3, 5]
            ]
        }
        const lineChartOptions = {
            low: 0,
            lineSmooth: false,
            axisX: {
                showGrid: false,
                showLabel: false
            },
            axisY: {
                showGrid: false,
                showLabel: false
            },
        }

        const currentTab = this.state.currentTab;

        return (
            <Paper className='graphCard'>
                <div className='header'>
                    <div>
                        <span>S/.</span>
                        <span className='totalRevenue'>{this.state.totalRevenue}</span>
                    </div>
                    <div>
                        <span>S/.</span>
                        <span className='rangeRevenue'>{this.state.rangeRevenue}</span>
                        <span> Hoy</span>
                    </div>
                </div>
                <ChartistGraph data={lineChartData} options={lineChartOptions} type={'Line'} />
                <Tabs
                    value={currentTab}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleTabChange}
                    centered
                    fullWidth
                >
                    <Tab label="1D" />
                    <Tab label="1W" />
                    <Tab label="1M" />
                    <Tab label="1Y" />
                    <Tab label="ALL" />
                </Tabs>
            </Paper>
        )
    }
}

export default ProductAnalytics