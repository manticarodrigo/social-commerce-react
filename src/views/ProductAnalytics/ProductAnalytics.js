import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from '../../components/Loading/Loading';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ChartistGraph from 'react-chartist';
import './ProductAnalytics.css';

import {
	updateTitle
} from '../../actions/navActions';
import {
    fetchProductAnalytics
} from '../../actions/productActions';

class ProductAnalytics extends Component {
	constructor(props) {
		super(props)
		const { user, product } = this.props;
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

		if (user && product.id != null) {
			this.props.updateTitle(product.name);
			this.fetchData(product.id, this.state.currentTab);
		} else {
			this.props.history.replace('/');
		}
	}

  componentDidMount() {
		const { updateTitle, product } = this.props;
		updateTitle(product ? product.name : 'Tu Producto');
	}

	fetchData = (productId, period) => {
		const { fetchProductAnalytics } = this.props;
		fetchProductAnalytics(productId, period)
			.then(() => {
				const { analytics } = this.props;
				if (analytics) {
					this.setState({
						labels: analytics.dates,
						values: analytics.quantities,
						totalRevenue: analytics.total_revenues,
						totalQuantity: analytics.total_quantity,
						loading: false
					});
				} else {
					alert('No se ha encontrado la data de analytica.');
					this.setState({
						loading: false
					});
				}
			});
	}

	handleTabChange = (event, currentTab) => {
		this.setState({ loading: true, currentTab } );
		this.fetchData(this.state.id, currentTab);
	}

	render() {
		// const { product } = this.props;
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
			showPoint: false,
			axisX: {
				showGrid: false,
				showLabel: false
			},
			axisY: {
				showGrid: false,
				showLabel: true,
				onlyInteger: true
			},
		}

		const currentTab = this.state.currentTab;
		const totalRevenue = this.state.totalRevenue ? this.state.totalRevenue : 0;
		const totalQuantity = this.state.totalQuantity ? this.state.totalQuantity : 0;
		const loading = this.state.loading;

		let dateLabel;
		switch(currentTab) {
			case '1D':
				dateLabel = 'las últimas 24hrs';
				break;
			case '1M':
				dateLabel = 'el último mes';
				break;
			case '1Y':
				dateLabel = 'los últimos 12 meses';
				break;
			case 'ALL':
				dateLabel = 'en total';
				break;
			default: // 1W
				dateLabel = 'los últimos 7 días';
				break;
		}

		return (
			<div>
				{loading && (
					<Loading />
				)}
				<div className='header'>
					<div>
						<span>S/.</span>
						<span className='totalRevenue'>{totalRevenue}</span>
					</div>
					<div>
						<span className='totalQuantity'>Vendidos <strong>{totalQuantity}</strong></span>
						<span> {dateLabel}</span>
					</div>
				</div>
				<ChartistGraph data={lineChartData} options={lineChartOptions} type={'Line'} />
				<Tabs
					className="datesTabs"
					value={currentTab}
					indicatorColor="primary"
					textColor="primary"
					onChange={this.handleTabChange}
					centered
					fullWidth
				>
					<Tab value={'1D'} label="1 Día" className="dateTab" />
					<Tab value={'1W'} label="1 Sem" className="dateTab" />
					<Tab value={'1M'} label="1 Mes" className="dateTab" />
					<Tab value={'1Y'} label="1 Año" className="dateTab" />
					<Tab value={'ALL'} label="Todas" className="dateTab" />
				</Tabs>
			</div>
		)
	}
}

const mapStateToProps = state => ({
  user: state.auth.user,
  product: state.products.currentProduct,
  analytics: state.products.analytics
});
  
const mapDispatchToProps = dispatch => bindActionCreators({
	updateTitle,
	fetchProductAnalytics
}, dispatch)
  
export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(ProductAnalytics)
);