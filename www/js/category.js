var categories = { 
  groups : [
	{'code':'agr',  'en':'Agriculture', 	'fr':'Agriculture'}, 
	{'code':'art',  'en':'Artistic', 		'fr':'Artistique'}, 
	{'code':'cons', 'en':'Construction', 	'fr':'Construction'}, 
	{'code':'corp', 'en':'Corporate', 		'fr':'Entreprise'}, 
	{'code':'edu',  'en':'Education', 		'fr':'Éducation'}, 
	{'code':'fin',  'en':'Finance', 		'fr':'Finance'}, 
	{'code':'good', 'en':'Goods', 			'fr':'Marchandises'}, 
	{'code':'gov',  'en':'Government', 	'fr':'Gouvernement'}, 
	{'code':'hlth', 'en':'Health', 			'fr':'Santé'}, 
	{'code':'leg',  'en':'Legal', 			'fr':'Légal'}, 
	{'code':'man',  'en':'Manufacturing', 'fr':'Fabrication'}, 
	{'code':'med',  'en':'Medical', 		'fr':'Médical'}, 
	{'code':'org',  'en':'Organization', 	'fr':'Organisation'}, 
	{'code':'rec',  'en':'Recreational', 	'fr':'Loisirs'}, 
	{'code':'serv', 'en':'Services', 		'fr':'Service'}, 
	{'code':'tech', 'en':'Technology', 	'fr':'Technologie'}, 
	{'code':'tran', 'en':'Transportation','fr':'Transport'}
],
  industries : [
	{'code':'47','groups':'corp, fin', 'en':'Accounting', 'fr':'Comptabilité'}, 
	{'code':'94','groups':'man, tech, tran', 'en':'Airlines/Aviation', 'fr':'Compagnies aériennes / aviation'}, 
	{'code':'120','groups':'leg, org', 'en':'Alternative Dispute Resolution', 'fr':'Règlement extrajudiciaire des différends'}, 
	{'code':'125','groups':'hlth', 'en':'Alternative Medicine', 'fr':'Médecine douce'}, 
	{'code':'127','groups':'art, med', 'en':'Animation', 'fr':'Animation'}, 
	{'code':'19','groups':'good', 'en':'Apparel & Fashion', 'fr':'Vêtements et mode'}, 
	{'code':'50','groups':'cons', 'en':'Architecture & Planning', 'fr':'Architecture et planification'}, 
	{'code':'111','groups':'art, med, rec', 'en':'Arts and Crafts', 'fr':'L\'artisanat'}, 
	{'code':'53','groups':'man', 'en':'Automotive', 'fr':'Automobile'}, 
	{'code':'52','groups':'gov, man', 'en':'Aviation & Aerospace', 'fr':'Aviation et aérospatiale'}, 
	{'code':'41','groups':'fin', 'en':'Banking', 'fr':'Bancaire'}, 
	{'code':'12','groups':'gov, hlth, tech', 'en':'Biotechnology', 'fr':'Biotechnologie'}, 
	{'code':'36','groups':'med, rec', 'en':'Broadcast Media', 'fr':'Média de diffusion'}, 
	{'code':'49','groups':'cons', 'en':'Building Materials', 'fr':'Matériaux de construction'}, 
	{'code':'138','groups':'corp, man', 'en':'Business Supplies and Equipment', 'fr':'Fournitures et équipements commerciaux'}, 
	{'code':'129','groups':'fin', 'en':'Capital Markets', 'fr':'Marchés de capitaux'}, 
	{'code':'54','groups':'man', 'en':'Chemicals', 'fr':'Produits chimiques'}, 
	{'code':'90','groups':'org, serv', 'en':'Civic & Social Organization', 'fr':'Organisation civique et sociale'}, 
	{'code':'51','groups':'cons, gov', 'en':'Civil Engineering', 'fr':'Génie civil'}, 
	{'code':'128','groups':'cons, corp, fin', 'en':'Commercial Real Estate', 'fr':'Immobilier commercial'}, 
	{'code':'118','groups':'tech', 'en':'Computer & Network Security', 'fr':'Sécurité informatique et réseau'}, 
	{'code':'109','groups':'med, rec', 'en':'Computer Games', 'fr':'Jeux informatiques'}, 
	{'code':'3','groups':'tech', 'en':'Computer Hardware', 'fr':'Matériel informatique'}, 
	{'code':'5','groups':'tech', 'en':'Computer Networking', 'fr':'Réseaux informatiques'}, 
	{'code':'4','groups':'tech', 'en':'Computer Software', 'fr':'Logiciel'}, 
	{'code':'48','groups':'cons', 'en':'Construction', 'fr':'Construction'}, 
	{'code':'24','groups':'good, man', 'en':'Consumer Electronics', 'fr':'Electronique grand public'}, 
	{'code':'25','groups':'good, man', 'en':'Consumer Goods', 'fr':'Biens de consommation'}, 
	{'code':'91','groups':'org, serv', 'en':'Consumer Services', 'fr':'Services aux consommateurs'}, 
	{'code':'18','groups':'good', 'en':'Cosmetics', 'fr':'Produits de beauté'}, 
	{'code':'65','groups':'agr', 'en':'Dairy', 'fr':'Laitier'}, 
	{'code':'1','groups':'gov, tech', 'en':'Defense & Space', 'fr':'Défense et espace'}, 
	{'code':'99','groups':'art, med', 'en':'Design', 'fr':'Conception'}, 
	{'code':'69','groups':'edu', 'en':'Education Management', 'fr':'Gestion de l\'éducation'}, 
	{'code':'132','groups':'edu, org', 'en':'E-Learning', 'fr':'E-Learning'}, 
	{'code':'112','groups':'good, man', 'en':'Electrical/Electronic Manufacturing', 'fr':'Fabrication électrique / électronique'}, 
	{'code':'28','groups':'med, rec', 'en':'Entertainment', 'fr':'Divertissement'}, 
	{'code':'86','groups':'org, serv', 'en':'Environmental Services', 'fr':'Services environnementaux'}, 
	{'code':'110','groups':'corp, rec, serv', 'en':'Events Services', 'fr':'Services d\'événements'}, 
	{'code':'76','groups':'gov', 'en':'Executive Office', 'fr':'Bureau exécutif'}, 
	{'code':'122','groups':'corp, serv', 'en':'Facilities Services', 'fr':'Services des installations'}, 
	{'code':'63','groups':'agr', 'en':'Farming', 'fr':'Agriculture'}, 
	{'code':'43','groups':'fin', 'en':'Financial Services', 'fr':'Services financiers'}, 
	{'code':'38','groups':'art, med, rec', 'en':'Fine Art', 'fr':'Beaux arts'}, 
	{'code':'66','groups':'agr', 'en':'Fishery', 'fr':'Pêcherie'}, 
	{'code':'34','groups':'rec, serv', 'en':'Food & Beverages', 'fr':'Nourriture et boissons'}, 
	{'code':'23','groups':'good, man, serv', 'en':'Food Production', 'fr':'Production alimentaire'}, 
	{'code':'101','groups':'org', 'en':'Fund-Raising', 'fr':'Collecte de fonds'}, 
	{'code':'26','groups':'good, man', 'en':'Furniture', 'fr':'Meubles'}, 
	{'code':'29','groups':'rec', 'en':'Gambling & Casinos', 'fr':'Jeux de hasard et casinos'}, 
	{'code':'145','groups':'cons, man', 'en':'Glass, Ceramics & Concrete', 'fr':'Verre'}, 
	{'code':'75','groups':'gov', 'en':'Government Administration', 'fr':'Administration gouvernementale'}, 
	{'code':'148','groups':'gov', 'en':'Government Relations', 'fr':'Relations gouvernementales'}, 
	{'code':'140','groups':'art, med', 'en':'Graphic Design', 'fr':'Conception graphique'}, 
	{'code':'124','groups':'hlth, rec', 'en':'Health, Wellness and Fitness', 'fr':'Santé'}, 
	{'code':'68','groups':'edu', 'en':'Higher Education', 'fr':'l\'enseignement supérieur'}, 
	{'code':'14','groups':'hlth', 'en':'Hospital & Health Care', 'fr':'Hôpital et soins de santé'}, 
	{'code':'31','groups':'rec, serv, tran', 'en':'Hospitality', 'fr':'Hospitalité'}, 
	{'code':'137','groups':'corp', 'en':'Human Resources', 'fr':'Ressources humaines'}, 
	{'code':'134','groups':'corp, good, tran', 'en':'Import and Export', 'fr':'Importer et exporter'}, 
	{'code':'88','groups':'org, serv', 'en':'Individual & Family Services', 'fr':'Services individuels et familiaux'}, 
	{'code':'147','groups':'cons, man', 'en':'Industrial Automation', 'fr':'L\'automatisation industrielle'}, 
	{'code':'84','groups':'med, serv', 'en':'Information Services', 'fr':'Services d\'information'}, 
	{'code':'96','groups':'tech', 'en':'Information Technology and Services', 'fr':'Technologie de l\'information et services'}, 
	{'code':'42','groups':'fin', 'en':'Insurance', 'fr':'Assurance'}, 
	{'code':'74','groups':'gov', 'en':'International Affairs', 'fr':'Les affaires internationales'}, 
	{'code':'141','groups':'gov, org, tran', 'en':'International Trade and Development', 'fr':'Commerce international et développement'}, 
	{'code':'6', 'groups':'tech', 'en':'Internet', 'fr':'l\'Internet'}, 
	{'code':'45','groups':'fin', 'en':'Investment Banking', 'fr':'Banque d\'investissement'}, 
	{'code':'46','groups':'fin', 'en':'Investment Management', 'fr':'Gestion des investissements'}, 
	{'code':'73','groups':'gov, leg', 'en':'Judiciary', 'fr':'Judiciaire'}, 
	{'code':'77','groups':'gov, leg', 'en':'Law Enforcement', 'fr':'Forces de l\'ordre'}
]};
