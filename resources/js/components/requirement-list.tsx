import { X } from 'lucide-react';
import LevelRequirementController from '@/actions/App/Http/Controllers/Configuration/LevelRequirementController';
import FormDialog from '@/components/form-dialog';
import RequirementFormDialog from '@/components/requirement-form-dialog';
import { Button } from '@/components/ui/button';
import { requirementLabel } from '@/lib/membership';
import type { LevelRequirement, MembershipLevel } from '@/types';

function RequirementChip({
    level,
    requirement,
}: {
    level: MembershipLevel;
    requirement: LevelRequirement;
}) {
    return (
        <span className="border-gold-400/20 flex items-center gap-1 rounded-full border bg-white/[0.03] py-1 pr-1 pl-3 text-sm text-white/80">
            {requirementLabel(requirement)}

            <RequirementFormDialog level={level} requirement={requirement} />

            <FormDialog
                trigger={
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Remove requirement"
                        className="text-destructive-foreground/70 hover:text-destructive-foreground size-7 [&>svg]:size-3.5"
                    >
                        <X />
                    </Button>
                }
                title="Remove requirement?"
                description={`${requirementLabel(requirement)} will no longer be asked of members reaching ${level.name}.`}
                form={LevelRequirementController.destroy.form(requirement.id)}
                submitLabel="Remove requirement"
                submitVariant="destructive"
            />
        </span>
    );
}

/** Every requirement on a level, plus the control that adds another. */
export default function RequirementList({ level }: { level: MembershipLevel }) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {level.requirements.map((requirement) => (
                <RequirementChip
                    key={requirement.id}
                    level={level}
                    requirement={requirement}
                />
            ))}

            <RequirementFormDialog level={level} />
        </div>
    );
}
