// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ColdCostGenerator } from '../../model/costs';
import { DebtGenerator } from '../../model/debts';
import { AnnualCostSeries, GraphData } from '../../model/graph';
import { sanierung } from '../../model/sanierung';
import { TilgungGenerator } from '../../model/tilgung';
import { WarmCostGenerator } from '../../model/warm_costs';

const stringParam = (param: string | string[]) => {
  return typeof param === "string" ? param : param[0]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<GraphData<AnnualCostSeries>>
) {
  const params = req.query;
  let kfwTilgungsZuschussIncluded = false;
  if (params.kfwTilgungInclusive !== undefined) {
    kfwTilgungsZuschussIncluded = stringParam(params.kfwTilgungInclusive) === "true";
  }

  const costGenerator = new ColdCostGenerator(sanierung,
    kfwTilgungsZuschussIncluded ? 0.25 : 0,
    kfwTilgungsZuschussIncluded ? 40000 : 0);
  const debtGenerator = new DebtGenerator(sanierung);
  const tilgungGenerator = new TilgungGenerator(sanierung);
  const warmCostGenerator = new WarmCostGenerator(sanierung);
  const activeVariant = (params.variant !== undefined) ? parseInt(stringParam(params.variant), 10) : 1;

  if (params.direktKredite !== undefined) {
    costGenerator.setDirektKredite(parseInt(stringParam(params.direktKredite), 10));
    debtGenerator.setDirektKredite(parseInt(stringParam(params.direktKredite), 10));
    tilgungGenerator.setDirektKredite(parseInt(stringParam(params.direktKredite), 10));
  }
  if (params.direktKreditZinsen !== undefined) {
    costGenerator.setDirektKreditZinsen(parseFloat(stringParam(params.direktKreditZinsen)));
    tilgungGenerator.setDirektKreditZinsen(parseFloat(stringParam(params.direktKreditZinsen)))
  }
  if (params.direktKreditTilgung !== undefined) {
    costGenerator.setDirektKreditTilgung(parseFloat(stringParam(params.direktKreditTilgung)));
    tilgungGenerator.setDirektKreditTilgung(parseFloat(stringParam(params.direktKreditTilgung)));
  }
  if (params.kfwKreditTilgung !== undefined) {
    costGenerator.setKfwKreditTilgung(parseFloat(stringParam(params.kfwKreditTilgung)));
    tilgungGenerator.setKfwKreditTilgung(parseFloat(stringParam(params.kfwKreditTilgung)));
  }
  if (params.kfwKreditZinsen !== undefined) {
    costGenerator.setKfwKreditZinsen(parseFloat(stringParam(params.kfwKreditZinsen)));
    tilgungGenerator.setKfwKreditZinsen(parseFloat(stringParam(params.kfwKreditZinsen)));
  }
  if (params.stromPreisCentskWh !== undefined) {
    warmCostGenerator.setStromPreisEuroProkWh(parseInt(stringParam(params.stromPreisCentskWh), 10) / 100);
  }
  if (params.gasPreisCentskWh !== undefined) {
    warmCostGenerator.setGasPreisEuroProkWh(parseInt(stringParam(params.gasPreisCentskWh), 10) / 100);
  }
  if (params.kfwTilgungInclusive !== undefined) {
    costGenerator.setKfwTilgungIncluded(stringParam(params.kfwTilgungInclusive) === "true");
  }

  res.status(200).json({
    name: 'Loan Cost',
    series: {
      coldCosts: costGenerator.generateVariants(),
      debts: debtGenerator.generateVariant(activeVariant),
      description: sanierung.getDescription(activeVariant),
      miete: {
        KaltMiete: costGenerator.generateVariant(activeVariant).Kaltmiete,
        WarmMiete: warmCostGenerator.generateVariant(activeVariant) + costGenerator.generateVariant(activeVariant).Kaltmiete,
      },
      tilgung: tilgungGenerator.generateVariant(activeVariant),
    },
  })
}
