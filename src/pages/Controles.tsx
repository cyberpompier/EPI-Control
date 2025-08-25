"use client";

import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

const Controles = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Liste des Contrôles | EPI Control</title>
      </Helmet>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Liste des Contrôles</h1>
          <p className="text-gray-600">Consultez et gérez l'historique des contrôles d'équipements.</p>
        </div>
      </div>
    </Fragment>
  );
};

export default Controles;