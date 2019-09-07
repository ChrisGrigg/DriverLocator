import React from 'react';
import './Container.css';
import GoogleMapReact from 'google-map-react';

const VehicleComponent = ({ name }) => <div>{name}</div>;

// TODO: split into seperate components for modularity
// TODO: implement Redux like https://github.com/ChrisGrigg/Credit_Card_Validator for app state and events
// TODO: make markers car icons with change in styling on hover or selection
// TODO: implement async/await on fetch api calls

class ContainerComponent extends React.Component {

	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.state = {
			error: null,
			isLoaded: false,
			items: []
		};
	}

	static defaultProps = {
		center: {
			lat: -27.477676,
			lng: 153.021022
		},
		zoom: 12
	};

	handleClick(vehicle) {
		const currentDriver = this.drivers.filter((value) => {
			return value.id === vehicle.driver_id;
		});
		this.setState({ 
			vehicle: vehicle.name,
			driverName: currentDriver[0] ? `${currentDriver[0].first_name} ${currentDriver[0].last_name}` : 'No driver is assigned!',
			capacity: vehicle.capacity,
			passengers: vehicle.passengers
		});
	}

	componentDidMount() {
		fetch("https://s3-ap-southeast-2.amazonaws.com/bridj-coding-challenge/vehicles.json")
			.then(res => res.json())
			.then(
				(result) => {
					this.setState({
						isLoaded: true,
						items: result.vehicles
					});
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)

		fetch("https://s3-ap-southeast-2.amazonaws.com/bridj-coding-challenge/drivers.json")
			.then(res => res.json())
			.then(
				(result) => {
					this.drivers = result.drivers;
				},
				(error) => {
					this.setState({
						isLoaded: true,
						error
					});
				}
			)


	}

	_onChildClick = (key, childProps) => {
		this.handleClick(childProps);
	}

	render() {
		const { error, isLoaded, items } = this.state;
		if (error) {
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div className="Container-body">
					<h4>Click on the buttons or map markers to view information on vehicles and drivers.</h4>
					<ul>
						{items.map(item => (
							<li key={item.id}>
								<button onClick={() => this.handleClick(item)}>{item.name}</button>
							</li>
						))}
					</ul>
					<div className="Text-container">
						<p><b>Driver:</b> {this.state.driverName}</p>
						<p><b>Vehicle:</b> {this.state.vehicle}</p>
						<p><b>Capacity:</b> {this.state.capacity}</p>
						<p><b>Passengers:</b> {this.state.passengers}</p>
					</div>
					<div className="Simple-map" style={{ height: '75vh', width: '75%' }}>
						<GoogleMapReact
							// bootstrapURLKeys={{ key: null }}
							defaultCenter={this.props.center}
							defaultZoom={this.props.zoom}
							onChildClick={this._onChildClick}
						>
							{items.map(item => (
								<VehicleComponent
									key={item.id}
									lat={item.latitude}
									lng={item.longitude}
									name={item.name}
									driver_id={item.driver_id}
									capacity={item.capacity}
									passengers={item.passengers}
								/>
							))}
						</GoogleMapReact>
					</div>
				</div>
			);
		}
	}
}

export default ContainerComponent;
