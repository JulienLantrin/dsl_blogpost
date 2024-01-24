import { BarChart, Bar, XAxis } from '../components'

export default function Home() {
  return (
      <BarChart width={1000}>
        <XAxis key='xAxisKey' label='XAxis' color='black'  thickness={2}/>
        <Bar key='key1' color='blue' height={100}/>
        <Bar key='key2' color='red' height={80}/>
        <Bar key='key3' color='green' height={120}/>
        <Bar key='key4' color='grey' height={10}/>
      </BarChart>
    )
}
