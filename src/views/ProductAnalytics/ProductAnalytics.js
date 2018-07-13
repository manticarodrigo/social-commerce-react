import React, { Component } from 'react';
import Loading from '../Loading/Loading'
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import ChartistGraph from 'react-chartist';
import './ProductAnalytics.css';
import { fetchProductsAnalytics } from '../../services/WordPress';


// function TabContainer(props) {
//   return (
//     <Typography component="div" style={{ padding: 8 * 3 }}>
//       {props.children}
//     </Typography>
//   );
// }

class ProductAnalytics extends Component {
    constructor(props) {
        super(props)

        const { user, product } = this.props
        if (!user || product === null) this.props.onBack()
        
        this.state = {
            id: product ? product.id : null,
            title: product ? product.name : '',
            totalRevenue: 0,
            totalQuantity: 0,
            currentTab: '1W',
            labels: [],
            values: [],
            loading: true
        };
    }

    fetchData = (productId, period) => {
        fetchProductsAnalytics(productId, period)
          .then(res => {
            console.log(res.data)
            this.setState({
                labels: res.data.dates,
                values: res.data.quantities,
                totalRevenue: res.data.total_revenues,
                totalQuantity: res.data.total_quantity,
                loading: false
            });
        })
    }

    handleTabChange = (event, currentTab) => {
        this.setState({ loading: true, currentTab } );
        this.fetchData(this.state.productId, currentTab);
    }

    componentDidMount() {
        this.props.navBarTitle(this.state.title);
        this.fetchData(this.state.productId, this.state.currentTab);
    }

    render() {
        const { product } = this.props;
        const { labels, values } = this.state;

        const lineChartData = {
            labels,
            series: [
                values
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
                showLabel: true
            },
        }

        const currentTab = this.state.currentTab;
        const totalRevenue = this.state.totalRevenue;
        const totalQuantity = this.state.totalQuantity;
        const loading = this.state.loading;

        let dateLabel;
        switch(currentTab) {
            case '1D':
                dateLabel = 'hoy';
                break;
            case '1W':
                dateLabel = 'esta semana';
                break;
            case '1M':
                dateLabel = 'este mes';
                break;
            case '1Y':
                dateLabel = 'este año';
                break;
            case 'ALL':
                dateLabel = 'en total';
                break;
        }

        return (
            <Paper className='graphCard'>
                {loading && (
                  <Loading />
                )}
                <div className='header'>
                    <div>
                        <span>S/.</span>
                        <span className='totalRevenue'>{totalRevenue}</span>
                    </div>
                    <div>
                        <span className='totalQuantity'>{totalQuantity}</span>
                        <span> Vendidos {dateLabel}</span>
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
                    <Tab value={'1D'} label="1D" />
                    <Tab value={'1W'} label="1W" />
                    <Tab value={'1M'} label="1M" />
                    <Tab value={'1Y'} label="1Y" />
                    <Tab value={'ALL'} label="ALL" />
                </Tabs>
            </Paper>
        )
    }
}

export default ProductAnalytics