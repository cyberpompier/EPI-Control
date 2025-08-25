"use client";

import { Fragment } from 'react';
import { Helmet } from 'react-helmet';

const Personnel = () => {
  return (
    <Fragment>
      <Helmet>
        <title>Personnel | EPI Control</title>
      </Helmet>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Personnel</h1>
          <p className="text-gray-600">Gestion des sapeurs-pompiers et de leurs équipements</p>
        </div>
      </div>
    </Fragment>
  );
};

export default Personnel;