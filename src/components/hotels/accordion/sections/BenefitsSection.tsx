
import { MenuItemText } from "../MenuItemText";
import { CollapsibleMenuItem } from "../CollapsibleMenuItem";
import { useTranslation } from "@/hooks/useTranslation";

export function BenefitsSection() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-0 pl-4 border-l-2 border-fuchsia-400/30">
      {/* Benefit 1 - 100% Occupancy */}
      <CollapsibleMenuItem title={`1.1-   ${t('hotels.accordion.benefits.fullOccupancy.title')}`} className="mb-1" titleClassName="text-[1.17rem]">
        <div className="space-y-4 text-left py-4">
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.fullOccupancy.point1')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.fullOccupancy.point2')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.fullOccupancy.point3')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.fullOccupancy.point4')}</p>
        </div>
      </CollapsibleMenuItem>
      
      {/* Benefit 2 - Lower Costs */}
      <CollapsibleMenuItem title={`1.2-   ${t('hotels.accordion.benefits.lowerCosts.title')}`} className="mb-1" titleClassName="text-[1.17rem]">
        <div className="space-y-4 text-left py-4">
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.lowerCosts.point1')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.lowerCosts.point2')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.lowerCosts.point3')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.lowerCosts.point4')}</p>
        </div>
      </CollapsibleMenuItem>
      
      {/* Benefit 3 - Better Staff Stability */}
      <CollapsibleMenuItem title={`1.3-   ${t('hotels.accordion.benefits.staffStability.title')}`} className="mb-1" titleClassName="text-[1.17rem]">
        <div className="space-y-4 text-left py-4">
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.staffStability.point1')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.staffStability.point2')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.staffStability.point3')}</p>
        </div>
      </CollapsibleMenuItem>
      
      {/* Benefit 4 - Additional Revenue */}
      <CollapsibleMenuItem title={`1.4-   ${t('hotels.accordion.benefits.additionalRevenue.title')}`} className="mb-1" titleClassName="text-[1.17rem]">
        <div className="space-y-4 text-left py-4">
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.additionalRevenue.point1')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.additionalRevenue.point2')}</p>
          <p className="text-base flex items-start"><span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400 mr-2 mt-1.5"></span> {t('hotels.accordion.benefits.additionalRevenue.point3')}</p>
        </div>
      </CollapsibleMenuItem>
    </div>
  );
}
