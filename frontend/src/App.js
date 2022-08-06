import React, { Component } from 'react';
import Select from 'react-select';
import { Line } from 'react-chartjs-2';
import './App.css';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prices: [],
      choosen_product: null,
      choosen_product_name: null,
    }
  }

  componentDidMount() {
    this.createSocketConnection()
  }

  createSocketConnection() {
    var socket_url = new URL(process.env.REACT_APP_BACKEND_SOCKET)
    var ws = new WebSocket(socket_url.href)
    ws.onmessage = evt => {
      var data = JSON.parse(evt.data)
      if (data && data.constructor === Object) {
        this.setState({prices: data})
      }
    }
    return ws
  }

  renderPrices() {
    return Object.entries(this.state.prices).map((price) => {
      if (
        this.state.choosen_product &&
        parseInt(this.state.choosen_product) !== parseInt(price[0])
      ) {
        return
      }
      else {
        return (
          <div
            key={price[0] + '-' + price[1].name}
            style={
              {
                display: 'flex'
              }
            }
          >
            <div
              className='table_cell'
            >
              {price[0]}
            </div>
            <div
              className='table_cell'
            >
              {price[1].name}
            </div>
            <div
              className='table_cell'
              style={
                {
                  backgroundColor: price[1].color,
                }
              }
            >
              {price[1].price}
            </div>
          </div>
        )
      }
    })
  }

  render() {
    return (
      <div>
        <div>
          <Select
            options={
                Array.from(
                  Object.entries(this.state.prices),
                  (price) => new Object(
                    {
                        "value": price[0],
                        "label": price[1].name,
                    }
                  )
                )
            }
            onChange={
              (e) => {
                this.setState(
                  {
                    choosen_product: (e) ? e.value : null,
                    choosen_product_name: (e) ? e.label : null,
                  }
                )
              }
            }
            isClearable={true}
          />
        </div>
        <div
          style={
            {
              display: 'flex',
              borderBottom: '1px solid',
            }
          }
        >
          <div
            className='table_cell'
          >
            №
          </div>
          <div
            className='table_cell'
          >
            Name
          </div>
          <div
            className='table_cell'
          >
            Price
          </div>
        </div>
        {this.renderPrices()}
        {this.state.choosen_product
          ? <div
              id={"product_history-" + this.state.choosen_product}
            >
              <Line
                options={
                  {
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                      },
                      title: {
                        display: true,
                        text: this.state.choosen_product_name,
                      },
                    },
                  }
                }
                data={
                  {
                    labels: Array.from(
                      Array(this.state.prices[this.state.choosen_product].timestamp),
                      (_, i) => i
                    ),
                    datasets: [
                      {
                        label: this.state.choosen_product_name,
                        data: this.state.prices[this.state.choosen_product].changes,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                      }
                    ],
                  }
                }
              />
            </div>
          : ''
        }
      </div>
    )
  }
}    

export default App;
