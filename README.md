# Les DSL (Domain Specific Languages), l’élégance de l’abstraction

Ce blogpost a pour rôle d’explorez le rôle essentiel des Domain Specific Languages (DSLs) à travers l’implémentation d'un diagramme à bandes. Cet article établira des parallèles avec la bibliothèque [recharts](https://recharts.org/) pour illustrer comment les DSLs peuvent apporter une valeur significative au développement Front-End. Découvrez comment cette abstraction peut révéler des perspectives intéressantes.

# Qu’est-ce qu’un DSL ?

DSL est l’acronyme de domain specific language. D’un point de vue purement technique, un DSL peut être de plus haut niveau qu’un langage de programmation dans le cas où il est “Embedded”. C’est à dire qu’il repose sur un langage hôte (par exemple TypeScript). Néanmoins, il y a également des DSLs “Internal” qui sont eux-mêmes exprimés en tant que langage propre doté d’un interpréteur spécifique. En somme, dans ce cas, le DSL est lui-même le langage (SQL par exemple).

Le DSL est défini à l’aide d’un champ lexical très précis décrivant un domaine métier. Le métier pouvant être très business (par exemple des ingrédients pour un DSL spécifique à des recettes de cuisine) mais également plutôt technique si l’on reprend l’exemple du SQL.

Ce type de langage améliore la compréhension et l’utilisation grace à une sémantique prédéfinie qui abstrait les détails d’implémentation. 

Il est possible de prendre l’exemple du DSL des tableaux HTML vis à vis de l’utilisation des `<div>`. A la lecture de l’exemple ci-dessous, le premier cas parait plus lisible. Un tableau (`<table>`) est déclaré, puis son contenu (`<tbody>`) avec des balises lignes (`<tr>`), en-tête (`<th>`) et valeurs (`<td>`). Dans le second cas, nous réutilisons une `<div>` pour tous ces différents éléments du domaine des tableaux ce qui porte à confusion. Néanmoins, il faut garder en tête que le rendu visuel peut être le même. Utiliser un DSL pour déclarer un tableau est simplement beaucoup plus lisible, scalable et réutilisable.

```jsx
import * as React from "react";

const TableExemple: React.FC = () => {
  return (
    <table>
      <tbody>
        <tr>
          <th>Colonne A</th>
          <th>Colonne B</th>
        </tr>
        <tr>
          <td>Valeur A</td>
          <td>Valeur B</td>
        </tr>
      </tbody>
    </table>
  );
};

const TableWithDivExemple: React.FC = () => {
  return (
    <div>
      <div className="row">
        <div>Colonne A</div>
        <div>Colonne B</div>
      </div>
      <div className="row">
        <div>Valeur A</div>
        <div>Valeur B</div>
      </div>
    </div>
  );
};
```

Pour reprendre l’exemple évoqué dans l’introduction, recharts permet de créer des graphiques avec des composants qui sont des attributs de ce graphique. On peut citer par exemple le type du graphe, les axes des abscisses et ordonnées, la légende, les formes…etc. L’utilisation de ce DSL permet de ne pas utiliser de hooks, de variables, de contrôle flow…etc.

# Pourquoi écrire un DSL ?

Un DSL a pour but d’améliorer la collaboration entre les experts du domaine métier et les développeurs. Un exemple concret est le domaine médical. Les médecins sont complètement étrangers aux listes et boucles. Néanmoins, ils comprendront mieux, qu’un développeur non-initié, les notions de patients, de maladies ou de pression sanguine.

Dans un second temps, un DSL est un langage réutilisable et modulable. Cela permet de gagner en rapidité et en efficacité une fois le DSL implémenté. Par exemple, l’utilisation d’une librairie comme recharts augmente la vitesse de développement des graphiques dans une application et cela sans avoir besoin de comprendre comment créer et gérer un chart manuellement.

# Comment écrire un DSL avec React ?

```jsx
<BarChart width="300" height="300" data={data}>
	<XAxis dataKey='name'/>
	<Bar color='red' dataKey='p1'/>
	<Bar color='green' dataKey='p2'/>
</BarChart>
```

Le cas d’usage sur lequel nous allons nous appuyer tout au long de cet article est la réalisation d’un diagramme à bandes le plus simple possible. Ici nous définissons une sémantique métier où `<BarChart>` représente le graphique dans son ensemble comme l’était `<table>` dans l’exemple d’introduction. `<XAxis>` représente le tracé d’un axe horizontal des abscisses sous le graphique et chaque élément Bar doit tracer une barre verticale partant de l’axe des abscisses et ayant une hauteur relative à la donnée injectée dans le diagramme.

Nous n’allons pas rentrer dans tous les détails de la création d’un DSL en React. Il s’agit d’un point de vue et d’une façon de faire qui n’est pas unique. Il y a notamment deux grandes familles d’implémentation de DSL : encodage final ou initial. Ici nous allons nous concentrer sur l’encodage initial ce qui signifie qu’à l’aide d’un interpréteur c’est le `<BarChart>` qui va avoir pour rôle de décrire l’opération de rendering de l’intégralité du graphique. Les autres composants sont des composants de langage mais, comme présenté ci-dessous, ce sont des null components. A l’inverse du `<BarChart>` , ils ne vont décrire aucune opération de rendering à faire dans le DOM.

Un exemple d’encoding final pourrait être l’implémentation d’un formulaire où chaque élément pourrait simplement à la suite s’occuper de décrire ses propres opérations de rendering à faire. Dans l’exemple suivant on pourrait imaginer que `<Label>`, `<Select>`, `<DatePicker>` et `<MultiSelect>` aient la responsabilité de render leur propre contenu.

```jsx
<Form data={data}>
	<Section title='Section 1'>
	  <Label color='red' dataKey='p1'/>
    <Select dataKey='p2'/>
	</Section>
  <Section title='Section 2'>
	  <DatePicker color='red' dataKey='p1'/>
    <MultiSelect dataKey='p2'/>
	<Section/>
</Form>
```

## Qu’est ce qu’un null component et à quoi il sert ?

### Le null component

La particularité d’un null component React est qu’il ne va rien render dans le DOM. C’est un composant qui définit ses props mais qui retourne `null`.

```tsx
const XAxis = (): null => {
	return null
}
```

Nous allons prendre l’exemple très simple d’un composant n’ayant aucune propriété.

### Mais alors à quoi peut-il bien servir?

C’est là qu’intervient la notion **d’interpréteur**. Le composant parent (`<BarChart/>`ci-dessous) interprète les descriptions renvoyées par ses enfants enfants. Ici nous prenons le cas le plus simple possible qui est simplement la récupération du nombre d’enfants mais à terme nous pourrons également lire les propriétés de chaque composant enfant pour modifier le rendu dans le DOM.

```tsx
const BarChart: React.FC<{}> = ({children}) => {
	const count = React.Children.count(children)
  console.log(`I have ${count} child(ren)`)
	return <></>
}
```

Ainsi si l’on exécute le code ci-dessous, la console va afficher `“I have 1 child(ren)”`.

```tsx
render(
	<BarChart>
		<XAxis />
  </BarChart>
)
```

Pour expliquer plus en détail ce qu’il se passe dans le composant parent, on récupère grâce à `React.Children.count(children)` le nombre d’enfants puis on l’affiche dans la console.

## Quelles libertés offrir au DSL et comment ajouter des contraintes ?

L’exemple précédent de l’axe des abscisses est plutôt pertinent. Il parait absurde de pouvoir donner au composant BarChart deux enfants XAxis. Ainsi, nous pouvons dans notre cas supposer qu’il faut un seul et unique <XAxis/> comme enfant et qu’il soit obligatoire. 

Pour ajouter ce type de contrainte à notre DSL deux méthodes se dégagent: le typage statique et la vérification runtime.

### Ajoutons du typage restrictif à notre composant BarChart

```tsx
const BarChart: React.FC<{children: React.ReactComponentElement<typeof XAxis>}> = 
	({children}) => {
		const count = React.Children.count(children)
    console.log(`I have ${count} child(ren)`)
		return <></>
}
```

L’ajout d’un type pour les children restreint de façon statique les possibilité au sein du DSL. Ainsi dans l’exemple ci-contre nous forçons le `BarChart` a avoir un unique enfant de type `XAxis`. De cette façon l’exemple ci-dessous va retourner une erreur de type. Le composant `BarChart` possède deux enfants alors que le type n’est pas une liste mais bien un seul élément de type `XAxis`.

```tsx
render(
	<BarChart> //type error
		<XAxis/>
    <XAxis/>
  </BarChart>
)
```

### Ajoutons un contrôle runtime sur les noms

Au niveau du runtime - au moment de l’exécution - il est possible d’ajouter toutes les règles métier plus ou moins complexes qui ont été identifiés lors de la création du DSL en tant que langage. Ces vérifications sont toujours possibles et permettent de contraindre l’utilisation du langage à un certain cadre de la même façon que dans une phrase de la langue française nous allons utiliser la structure nom - verbe - complément dans le cadre d’une affirmation et cela serait incorrect d’intervertir l’ordre des mots.  Ce type de vérification permet de n’avoir par exemple qu’un seul et unique axe des abscisses et nombre de barres strictement supérieur à 0. Le code ci-dessous fait ces deux vérifications. On pourrait évidemment imaginer d’autres règles à implémenter. 

```tsx
const xAxisComponentName = 'XAxis'
const barComponentName = 'Bar'
let xAxisCount = 0
let barCount = 0

React.Children.forEach(children, (child) => {
	if (child.type.name === xAxisComponentName) {
		xAxisCount++
	}
  if (child.type.name === barComponentName) {
		barCount++
	}
}
if (xAxisCount !== 1){
  throw new Error(
		  `You must have a single XAxis component as BarChart child`
	 );
}
if (barCount === 0){
  throw new Error(
		  `You must have at least one Bar component as BarChart child(ren)`
	 );
}
```

Ainsi, le code ci-dessous retournera une erreur à l’exécution.

```tsx
render(
	<BarChart>
		<XAxis />
		<XAxis />
  </BarChart>
)
```

Les deux types de contrôle peuvent être associés en fonction de vos besoins et de ce que vous souhaitez faire. De façon générale le contrôle runtime vient compléter les lacunes de Typescript en terme de typage des composants enfants.

## Récupération des props de XAxis pour les afficher

Maintenant que nous sommes en mesure d’avoir un DSL structuré comportant des règles bien définies, il faut effectivement interpreter le composant `XAxis` au niveau du `BarChart`. Pour ce faire il va falloir récupérer les valeur de ses props (à savoir le `label`) et ainsi simplement les afficher dans une div.

```jsx
type XAxisProps = {
    label:string
}
```

```tsx
const BarChart: React.FC<{children: React.ReactComponentElement<typeof XAxis>}> = 
	({children}) => {
	const authorizedChildrenComponentNames = ['XAxis']
	React.Children.forEach(children, (child) => {
		if (!authorizedChildrenComponentNames.includes(child.type.name)) {
			throw new Error(
			  `The component ${child.type.name} must not appear as child`
		  );
		}
	})
	return 
		<>
			{React.Children.map(children,(child)=>(
				/** 
				 * Here we know that children is an uniq child XAxis
				 * and the props key is mandatory for XAxis component
			   * that means key can't be undefined in this mapping.
				 */
					<div>
						{child.props.key}
					</div>
			))}
		</>
}
```

## Implémentation d’un XAxis

### Définition des props

Pour conserver un exemple simple on se propose d’ajouter comme props au XAxis :

- `key`
- `thickness`
- `color`
- `label`

En TypeScript nous auront donc un type 

```tsx
type XAxisProps = {
	key: string,
	thickness: number,
	color: string,
	label: string
}
```

### Tracer une ligne avec les props définies

```tsx
const BarChart: React.FC<{
	children: React.ReactComponentElement<typeof XAxis>,
	width: string,
	height: string
}> = 
	({children}) => {
	const authorizedChildrenComponentNames = ['XAxis']

	React.Children.forEach(children, (child) => {
		if (!authorizedChildrenComponentNames.includes(child.type.name)) {
			throw new Error(
			  `The component ${child.type.name} must not appear as child`
		  );
		}
	})

	return <>
            {React.Children.map(children, (child) => {
		        const { thickness, color, label } = child.props
		        return (
			        <>
				        <div key={child.key} style={{'height':thickness, 'width':thickness, 'backgroundColor':color}}/>
				        <div>{label}</div>
			        </>
                )
	        })}
        </>
}
```

## Implémentation des barres

De la même façon que pour `XAxis`, nous allons ajouter un nouvel élément à notre DSL, cela passe par la création d’un null component pour les barres.

```tsx
 type BarProps = {
	key: string,
	color: string,
	height: number
}

const Bar = ({ key, color, height }: BarProps): null => {
	return null
}
```

Ainsi il faut changer le type des children du BarChart

```tsx
const isBar = (component: React.ReactComponentElement<typeof XAxis>
													| React.ReactComponentElement<typeof Bar>)
								: component is React.ReactComponentElement<typeof Bar> => {
 return component.type.name === 'Bar'
}

const isXAxis = (component: React.ReactComponentElement<typeof XAxis>
													| React.ReactComponentElement<typeof Bar>)
								: component is React.ReactComponentElement<typeof XAxis> => {
 return component.type.name === 'XAxis'
}

const BAR_WIDTH = '20px'

const BarChart :React.FC<{
    children: Array<React.ReactComponentElement<typeof XAxis>
            | React.ReactComponentElement<typeof Bar>>,
    width:string,
    height:string }> = ({ children, width, height }) => {
    const authorizedChildrenComponentNames = ['XAxis','Bar']
    React.Children.forEach(children, (child) => {
        if (!authorizedChildrenComponentNames.includes(child.type.name)) {
            throw new Error(`The component ${child.type.name} must not appear as child`);
        }
    })

    //Throw new error if more than one XAxis
    const xAxisCount = children.filter(
        (child) => React.isValidElement(child) && child.type === XAxis
    ).length;
    
    if (xAxisCount !== 1) {
        throw new Error('BarChart requires exactly one XAxis component.');
    }

    return <>
        {React.Children.map(children,(child)=>{
            if(isXAxis(child)){
                const { thickness, color, label } = child.props
                return (
                    <>
				        <div key={child.key} style={{'height':thickness, 'width':width, 'backgroundColor':color}}/>
				        <div>{label}</div>
			        </>
                )
            }
            if(isBar(child)){
                const { color, height:bar_heigth } = child.props
                return (
				    <div key={child.key} style={{'height':bar_heigth, 'width':BAR_WIDTH, 'backgroundColor':color}}/>
                )
            }
            else{
                return null
            }
        })}   
    </>
}
```

Comme évoqué dans un paragraphe précédent, les limitations de Typescript ne nous permettent pas ici de forcer au niveau du typage statique d’avoir un unique composant enfant `XAxis` et plusieurs composants enfants `Bar`. Il en va de même lorsque l’on utilise la librairie de référence recharts. Le premier `XAxis` est pris en compte mais rien ne vous empêche de mettre plusieurs composant enfants `XAxis`. 

Comme vu précédemment il serait par contre possible de filter la liste des enfants et émettre une erreur runtime si jamais deux enfants `XAxis` sont présents.

# Pourquoi pas juste des props ?

Chaque composant est une brique du graphe, et ses propriétés caractérise sa configuration. Ainsi, sans définir de DSL, la complexité des props augmente de façon exponentielle avec la complexité du métier. Il devient très rapidement difficile à lire. Un non-développeur comprendra beaucoup mieux la version avec des composants enfants. Le problème vient également du fait qu’ajouter des props pour chaque nouveau besoin devient vite illisible, comparer à des composants dédiés à chaque besoin. Kent C. Dodds a écrit un [très bon article](https://epicreact.dev/soul-crushing-components/) à ce sujet.

Props:

```jsx
<BarChart xAxis={{ dataKey: "name" }} bars={[{ dataKey: "p1", color: "red" }, { dataKey: "p1", color:"green" }]} />
```

Composants:

```jsx
<BarChart width='100px' height='100px'>
		<XAxis key='xAxisKey' label='XAxis' color='black'  thickness={8}/>
    <Bar key='key1' color='blue' height={100}/>
    <Bar key='key2' color='red' height={80}/>
</BarChart>
```

Par ailleurs, chaque composant étant indépendant, il est possible de l’extraire et de le réutiliser ce qui créé un caractère composable à nos graphiques. Concrètement, nous avons pris l’exemple d’un diagramme à bandes mais si demain nous désirons développer un graphique à lignes le composant `<XAxis>` sera réutilisable tel quel ! 

Si par ailleurs nous souhaitons étendre le domain du DSL, par exemple ajouter une légende au diagramme à bande, il est possible de le faire sans modifier l’interface des composants `<XAxis>` et `<Bar>`.

Ainsi, dans le temps, l’écriture de ce DSL est un réel gain de productivité et d’efficacité.

# Dans quel cas écrire un DSL ?

Comme présenté ci-dessus, il est possible de mettre en avant les caractéristiques de réutilisation et de composition des DSL. D’autre part, le code est partageable avec le métier et/ou les autres développeurs car il est extrêmement lisible et très parlant d’un point de vue métier (cela concerne également les métiers techniques !)

# Dans quels cas NE PAS écrire un DSL ?

Dans le cas où le sujet traité n’a pas du tout vocation à être réutilisé il ne parait pas nécéssaire de créer un DSL car cela va être chronophage. En effet, spécifier un DSL et l’encoder nécessite du temps donc si le sujet traité est mineur et très spécifique à une implémentation précise dans une partie de la codebase un DSL n’aura pas grand intérêt.

Il est plus difficile d’écrire un bon DSL que d’écrire directement le résultat attendu. Cela est dû aux raisons évoquées plus haut. Il faut trouver le bon niveau d’abstraction pour que votre DSL corresponde à la réalité métier et au domaine que l’on souhaite décrire.

Enfin, si le métier est en constante évolution ça n’est pas non plus le plus pertinent d’implémenter un DSL car il nécessite une reflexion qui devra être revue dans le temps en permanence.

# Pour aller plus loin

L’article se veut être un introduction au sujet des DSL implémentés en React. Il est possible de creuser le sujet via différentes ressources telles que cette [présentation](https://www.youtube.com/watch?v=ODI1h4Snst8) de Martin Fowler disponible gratuitement sur Youtube ou encore cet [article](https://dev.to/effect-ts/building-custom-dsls-in-typescript-29el) rédigé par Michael Arnaldi.
