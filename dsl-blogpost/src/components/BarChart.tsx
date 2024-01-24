import * as React from 'react'
import { XAxis, isXAxis } from './XAxis'
import { Bar, isBar } from './Bar'


export const BarChart: React.FC<{
    children: Array<React.ReactComponentElement<typeof XAxis> | React.ReactComponentElement<typeof Bar>>,
    width: number
  }> = ({ children, width }) => {
    const authorizedChildrenComponentNames = ['XAxis', 'Bar'];
  
    React.Children.forEach(children, (child) => {
      if (!authorizedChildrenComponentNames.includes(child.type.name)) {
        throw new Error(`The component ${child.type.name} must not appear as a child`);
      }
    });
  
    // Throw an error if more than one XAxis
    const xAxisCount = children.filter(
      (child) => React.isValidElement(child) && child.type === XAxis
    ).length;
  
    if (xAxisCount !== 1) {
      throw new Error('BarChart requires exactly one XAxis component.');
    }
  
    const barCount = children.filter(
      (child) => React.isValidElement(child) && child.type === Bar
    ).length;
  
    const BAR_WIDTH = (width - 20 * 2 - 10 * (barCount - 1)) / barCount; // Ajout de marges de 20px à gauche et à droite
  
    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: width }}>
          {React.Children.map(children, (child, index) => {
            if (isBar(child)) {
              const { color, height: bar_height } = child.props;
              const marginLeft = index === 0 ? 20 : 10; // Marge de 20px à gauche pour la première barre, 10px pour les suivantes
              const marginRight = index < barCount - 1 ? 10 : 20; // Marge de 20px à droite pour la dernière barre, 10px pour les précédentes
              return (
                <div key={child.key} style={{ height: bar_height, width: BAR_WIDTH, backgroundColor: color, marginLeft, marginRight, alignSelf: 'flex-end' }} />
              );
            }
            return null;
          })}
        </div>
        <>
          {React.Children.map(children, (child) => {
            if (isXAxis(child)) {
              const { thickness, color, label } = child.props;
              return (
                <>
                  <div key={child.key} style={{ height: thickness, width: width, backgroundColor: color }} />
                  <div>{label}</div>
                </>
              );
            }
            return null;
          })}
        </>
      </>
    );
  };
